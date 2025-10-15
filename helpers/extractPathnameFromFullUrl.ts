/**
 * Extract the pathname from a full url
 * Can be used on both client and server
 * @param url - The full url to extract the pathname from
 * @returns The pathname
 */
export function extractPathnameFromFullUrl(url: string) {
  // remove protocol
  if (url.startsWith("http")) {
    url = url.replace(/^https?:\/\/[^\/]+/, "");
  }

  //remove hash
  if (url.includes("#")) {
    url = url.split("#")[0];
  }

  //remove query string
  if (url.includes("?")) {
    url = url.split("?")[0];
  }

  const firstSlashIndex = url.indexOf("/");
  let pathname = url.substring(firstSlashIndex);
  if (!pathname.startsWith("/")) {
    pathname = "/" + pathname;
  }
  return pathname;
}
