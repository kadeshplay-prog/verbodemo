"""Bibliotecas de WebKit en espacio de usuario para Debian 13 amd64 sin sudo.

No modifica APT ni el sistema. Descarga desde Debian por HTTPS, comprueba SHA-256
contra su índice y extrae únicamente en work/. En otras plataformas usar el
instalador de dependencias oficial de Playwright con el administrador del entorno.
"""
from pathlib import Path
from urllib.request import urlopen
import hashlib
import json
import lzma
import platform
import subprocess
import os
import sys

root = Path(__file__).resolve().parent.parent
if platform.system() != 'Linux' or platform.machine() != 'x86_64':
    raise SystemExit('Este recurso solo admite Linux amd64 con Debian 13.')
release = Path('/etc/os-release').read_text()
if 'VERSION_ID="13"' not in release or 'ID=debian' not in release:
    raise SystemExit('Se requiere Debian 13; no cargar estas bibliotecas en otro sistema.')

base = 'https://deb.debian.org/debian/'
packages = {
    'libgtk-4-1', 'libgraphene-1.0-0', 'libharfbuzz-icu0',
    'libmanette-0.2-0', 'libhyphen0', 'libgles2',
    'libcloudproviders0', 'libcolord2', 'libevdev2', 'libglvnd0',
    'libcairo-script-interpreter2', 'libhidapi-hidraw0',
    'liblzo2-2',
}
downloads = root / 'work/browser-debs'
destination = root / 'work/browser-libs'
downloads.mkdir(parents=True, exist_ok=True)
destination.mkdir(parents=True, exist_ok=True)
lock = root / 'docs/tooling/debian-browser-libs.lock.json'
if lock.exists():
    selected = json.loads(lock.read_text())['packages']
    if {p['Package'] for p in selected} != packages:
        raise SystemExit('El lock no coincide con el inventario; revisar y regenerar explícitamente antes de continuar.')
else:
    print('Leyendo el índice oficial de Debian 13…', flush=True)
    with urlopen(base + 'dists/trixie/main/binary-amd64/Packages.xz', timeout=60) as response:
        index = lzma.decompress(response.read()).decode()
    selected = []
    for paragraph in index.split('\n\n'):
        fields = dict(line.split(': ', 1) for line in paragraph.splitlines() if ': ' in line and not line.startswith(' '))
        if fields.get('Package') in packages:
            selected.append({key: fields[key] for key in ['Package', 'Version', 'Filename', 'SHA256']})
    if {p['Package'] for p in selected} != packages:
        raise SystemExit('El índice no contiene todas las dependencias; no se modificó el sistema.')
    lock.write_text(json.dumps({'distribution': 'Debian 13 trixie amd64', 'source': base, 'packages': selected}, indent=2) + '\n')

for package in selected:
    path = downloads / Path(package['Filename']).name
    if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest() != package['SHA256']:
        with urlopen(base + package['Filename'], timeout=60) as response:
            data = response.read()
        if hashlib.sha256(data).hexdigest() != package['SHA256']:
            raise SystemExit('Checksum incorrecto: ' + package['Package'])
        path.write_bytes(data)
    subprocess.run(['dpkg-deb', '--extract', str(path), str(destination)], check=True)
    print(package['Package'], package['Version'], flush=True)
libraries = ['libgtk-4.so.1', 'libgraphene-1.0.so.0', 'libharfbuzz-icu.so.0', 'libmanette-0.2.so.0', 'libhyphen.so.0', 'libGLESv2.so.2']
library_path = str(destination / 'usr/lib/x86_64-linux-gnu')
env = {**os.environ, 'LD_LIBRARY_PATH': library_path + (':' + os.environ['LD_LIBRARY_PATH'] if os.environ.get('LD_LIBRARY_PATH') else '')}
subprocess.run([sys.executable, '-c', 'import ctypes, sys; [ctypes.CDLL(name) for name in sys.argv[1:]]', *libraries], check=True, env=env)
# MiniBrowser del bundle de WebKit reemplaza LD_LIBRARY_PATH. Enlazar solo
# bibliotecas ausentes dentro de su sys/lib local, sin editar el wrapper oficial.
bundles = list((root / 'work/playwright-browsers').glob('webkit-*/minibrowser-*'))
if not bundles:
    raise SystemExit('Ejecutar npm run browsers:install antes de instalar estas bibliotecas.')
for bundle in bundles:
    local_libs = bundle / 'sys/lib'
    local_libs.mkdir(parents=True, exist_ok=True)
    for library in (destination / 'usr/lib/x86_64-linux-gnu').iterdir():
        target = local_libs / library.name
        if '.so' in library.name and not target.exists() and not target.is_symlink():
            target.symlink_to(os.path.relpath(library, local_libs))
    runtime_env = {**os.environ, 'LD_LIBRARY_PATH': str(bundle / 'lib') + ':' + str(local_libs)}
    result = subprocess.run(['ldd', str(bundle / 'bin/MiniBrowser')], check=True, capture_output=True, text=True, env=runtime_env)
    missing = [line for line in result.stdout.splitlines() if 'not found' in line]
    if missing:
        raise SystemExit('Dependencias aún ausentes: ' + '\n'.join(missing))
(destination / 'verified.json').write_text(json.dumps({'libraries': libraries, 'verification': 'ctypes.CDLL', 'distribution': 'Debian 13 amd64'}) + '\n')
print('Bibliotecas locales listas. Ejecutar npm test para comprobar los navegadores.')
