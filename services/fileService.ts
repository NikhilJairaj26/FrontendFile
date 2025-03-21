import * as FileSystem from 'expo-file-system';
import { Transfer } from '../types';

const API_URL = process.env.API_URL || 'https://your-backend-url.com/api'; // Ensure API URL is defined

interface FileResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  qrCodeUrl?: string;
}

interface UploadResponse {
  file: FileResponse;
  qrCodeUrl: string;
}

interface SendResponse {
  success: boolean;
  message: string;
}

interface ReceiveResponse {
  file: FileResponse;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response.json();
};

/**
 * Fetch recent file transfers for the authenticated user.
 */
export const getRecentTransfers = async (token: string): Promise<Transfer[]> => {
  try {
    const response = await fetch(`${API_URL}/files/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);

    return data.map((item: any) => ({
      id: Number(item.id), // Ensure id is a number
      fileName: item.name || 'Unknown File',
      size: item.size ? `${item.size} MB` : 'Unknown',
      sender: item.sender || 'Unknown Sender',
      recipient: item.recipient || 'Unknown Recipient',
      date: item.date || new Date().toISOString(),
      fileType: item.fileType || 'document',
    }));
  } catch (err) {
    console.error('Error fetching recent transfers:', err);
    throw err;
  }
};

/**
 * Upload a file to the server.
 */
export const uploadFile = async (fileUri: string, token: string): Promise<UploadResponse> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileUri.split('/').pop(),
      type: 'application/octet-stream',
    } as any);

    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await handleResponse(response);
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};

/**
 * Send a file to a recipient using their ID.
 */
export const sendFile = async (
  fileId: string,
  token: string,
  recipientId: string
): Promise<SendResponse> => {
  try {
    const response = await fetch(`${API_URL}/files/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileId, recipientId }),
    });

    return await handleResponse(response);
  } catch (err) {
    console.error('Error sending file:', err);
    throw err;
  }
};

/**
 * Receive a file using its ID.
 */
export const receiveFile = async (token: string, fileId: string): Promise<ReceiveResponse> => {
  try {
    const response = await fetch(`${API_URL}/files/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileId }),
    });

    return await handleResponse(response);
  } catch (err) {
    console.error('Error receiving file:', err);
    throw err;
  }
};