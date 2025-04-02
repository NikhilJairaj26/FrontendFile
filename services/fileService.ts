import { Platform } from 'react-native';

const API_BASE_URL = 'http://192.168.137.108:5000/api/auth/upload';

interface FileType {
  uri: string;
  name: string;
  type: string;
}

export const uploadFile = async (file: FileType, token: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
    name: file.name,
    type: file.type,
  } as any);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('File upload failed');
  return response.json();
};

export const sendFile = async (fileId: any, token: string, recipientId: string) => {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ fileId, recipientId }),
  });

  if (!response.ok) throw new Error('File send failed');
  return response.json();
};
