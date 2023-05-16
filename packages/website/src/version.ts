export function showVersion(container: HTMLElement) {
  const version = import.meta.env.VERSION!;

  const versionElement = document.createElement('div');
  versionElement.innerHTML = version;

  container.appendChild(versionElement);
}
