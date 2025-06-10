export type UploadResponse = {
  key: string;
  location: string;
};

export async function uploadFileToS3(data: FormData): Promise<UploadResponse> {
  const res = await fetch('/upload', {
    method: 'POST',
    body: data,
  });
  if (!res.ok) throw new Error(`Request failed with status code ${res.status}`);
  return res.json();
}
