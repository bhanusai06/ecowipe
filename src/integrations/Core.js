const API_BASE_URL = process.env.REACT_APP_API_URL !== undefined 
  ? process.env.REACT_APP_API_URL 
  : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export async function List(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch data');
  }
  return response.json();
}

export async function Read(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch resource');
  }
  return response.json();
}

export async function Create(path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create resource');
  }
  return response.json();
}

export async function Update(path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update resource');
  }
  return response.json();
}

export async function SendEmail({ to, subject, body }) {
  // In a real application, you might have a dedicated email route or use a service directly
  console.log("Email request received:", { to, subject, body });
  // For now, we'll just log it or you could implement a real backend route for this
  return { success: true, message: "Email sent successfully (simulated)." };
}

export async function UploadFile({ file }) {
  // Real implementation for file upload
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'File upload failed');
  }
  return response.json();
}
