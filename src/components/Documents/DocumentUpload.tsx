import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadDocument } from '../../api/documents';
import { Document } from '../../types';

interface DocumentUploadProps {
  applicationId: number;
  onUploadComplete?: (document: Document) => void;
}

const DOCUMENT_TYPES = [
  { value: 'ID_SCAN', label: 'ID Scan' },
  { value: 'PROOF_OF_RESIDENCE', label: 'Proof of Residence' },
  { value: 'PAYSLIP', label: 'Payslip' },
  { value: 'SIGNATURE', label: 'Signature' }
] as const;

type DocumentType = typeof DOCUMENT_TYPES[number]['value'];

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  applicationId,
  onUploadComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType>('ID_SCAN');
  const [dragActive, setDragActive] = useState(false);
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: DocumentType }) => {
      if (!token) throw new Error('No authentication token');
      return uploadDocument(applicationId, file, type, token);
    },
    onSuccess: (document: Document) => {
      toast.success('Document uploaded successfully!');
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      onUploadComplete?.(document);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload document');
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, GIF, and PDF files are allowed');
      return false;
    }

    return true;
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate({ file: selectedFile, type: selectedType });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Upload Documents
      </h3>

      {/* Document Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as DocumentType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={uploadMutation.isPending}
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload Area */}
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              Drop your file here, or{' '}
              <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-500 cursor-pointer">
                browse
              </label>
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, GIF, PDF (max 5MB)
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.pdf"
            onChange={handleFileSelect}
            disabled={uploadMutation.isPending}
          />
        </div>
      ) : (
        /* Selected File Preview */
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={uploadMutation.isPending}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          )}

          {/* Upload Success */}
          {uploadMutation.isSuccess && (
            <div className="mt-4 flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Upload completed successfully!</span>
            </div>
          )}

          {/* Upload Error */}
          {uploadMutation.isError && (
            <div className="mt-4 flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Upload failed. Please try again.</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploadMutation.isSuccess && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {uploadMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </button>
          <button
            onClick={() => setSelectedFile(null)}
            disabled={uploadMutation.isPending}
            className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};