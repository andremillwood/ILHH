export async function uploadToR2(file: File, purpose: 'mix' | 'artwork' | 'gallery', authHeader: string, galleryId?: number) {
  const response = await fetch('/api/mixtapes?action=sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size, purpose, galleryId }),
  });
  const signed = await response.json();
  if (!response.ok) throw new Error(signed.error || 'Could not prepare upload');

  const upload = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!upload.ok) throw new Error(`Cloudflare upload failed (${upload.status})`);
  return signed.publicUrl as string;
}
