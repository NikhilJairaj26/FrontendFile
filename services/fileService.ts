import * as FileSystem from 'expo-file-system';

const API_URL = process.env.API_URL;

interface FileResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  qrCodeUrl?: string; // Optional QR code URL for file sharing
}

interface Transfer {
  id: string;
  fileName: string;
  fileSize: string;
  sender: string;
  recipient: string;
  date: string;
}

interface UploadResponse {
  file: FileResponse;
  qrCodeUrl: string; // QR code URL for file sharing
}

interface SendResponse {
  success: boolean;
  message: string;
}

interface ReceiveResponse {
  file: FileResponse;
}

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

    if (!response.ok) {
      throw new Error('Failed to fetch recent transfers');
    }

    return await response.json();
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
      name: fileUri.split('/').pop(), // Extract file name from URI
      type: 'application/octet-stream', // Default MIME type
    } as any);

    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return await response.json();
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
      body: JSON.stringify({
        fileId,
        recipientId,
      }),
    });

    if (!response.ok) {
      throw new Error('File send failed');
    }

    return await response.json();
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

    if (!response.ok) {
      throw new Error('File receive failed');
    }

    return await response.json();
  } catch (err) {
    console.error('Error receiving file:', err);
    throw err;
  }
};