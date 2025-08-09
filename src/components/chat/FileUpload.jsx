import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const FileUpload = ({ onFileUpload, onClose, maxSize = 5 * 1024 * 1024 }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    
    // Check file size
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`Files must be smaller than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Check file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
    const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError('Only images (JPEG, PNG, GIF, WebP), PDF, and text files are allowed');
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, [maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: maxSize
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    try {
      for (const fileData of uploadedFiles) {
        await onFileUpload(fileData.file);
      }
      setUploadedFiles([]);
      onClose();
    } catch (error) {
      setError('Failed to upload files. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {isDragActive
                ? "Drop files here..."
                : "Drag & drop files here, or click to select"
              }
            </p>
            <p className="text-sm text-gray-500">
              Max size: {Math.round(maxSize / 1024 / 1024)}MB • Images, PDF, Text files
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Files to upload ({uploadedFiles.length})
              </h4>
              <div className="space-y-3">
                {uploadedFiles.map((fileData) => (
                  <div
                    key={fileData.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {fileData.preview ? (
                      <img
                        src={fileData.preview}
                        alt="Preview"
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <FileImage className="w-10 h-10 text-gray-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileData.file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(fileData.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
