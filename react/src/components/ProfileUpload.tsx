"use client";

import React, { useState } from "react";
import axios from "axios";

type NormalizedProfile = any;

type Props = {
  onComplete?: (profileText: string, career: string) => void;
};

export default function ProfileUpload({ onComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [normalized, setNormalized] = useState<NormalizedProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert("Please choose a file first");
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${backendBase}/api/upload-profile`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRawText(res.data.raw_text || "");
      setNormalized(null);
    } catch (err: any) {
      alert("Upload failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // --------- NEW: chỉ Normalize (không lưu) ----------
  const normalizeOnly = async () => {
    if (!rawText) return alert("No text to normalize");
    setLoading(true);
    try {
      const res = await axios.post(`${backendBase}/api/normalize-profile`, { profile_text: rawText });
      setNormalized(res.data.normalized_profile || null);
    } catch (err: any) {
      alert("Normalize failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // --------- NEW: Save normalized JSON ----------
  const saveNormalized = async () => {
    if (!normalized) return alert("No normalized profile to save. Click Normalize first.");
    setLoading(true);
    try {
      const res = await axios.post(`${backendBase}/api/save-profile`, { normalized_profile: normalized });
      setNormalized(res.data.normalized_profile || null);
      const savedPath = res.data.saved_path || "";
      alert("Saved profile to: " + savedPath);
      // callback if needed
      const career = res.data.normalized_profile?.CareerGoal || "";
      if (onComplete) onComplete(rawText, career);
    } catch (err: any) {
      alert("Save failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------- original combined Normalize & Save kept but commented ----------
  // const submitEditedText = async () => {
  //   if (!rawText) return alert("No text to submit");
  //   setLoading(true);
  //   try {
  //     const res = await axios.post(`${backendBase}/api/profile-from-text`, { profile_text: rawText });
  //     setNormalized(res.data.normalized_profile);
  //     const career = res.data.normalized_profile?.CareerGoal || "";
  //     if (onComplete) onComplete(rawText, career);
  //   } catch (err: any) {
  //     alert("Error: " + (err?.response?.data?.detail || err.message));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-2">Upload profile (pdf / docx / txt)</h3>
      <input type="file" accept=".pdf,.docx,.txt" onChange={onFileChange} />
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={uploadFile} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload & Scan"}
        </button>

        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={normalizeOnly} disabled={!rawText || loading}>
          {loading ? "Working..." : "Normalize"}
        </button>

        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={saveNormalized} disabled={!normalized || loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Scanned text (you can edit)</h4>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={10}
          className="w-full border p-2"
          placeholder="Scanned content will appear here for review..."
        />
      </div>

      {normalized && (
        <div className="mt-4">
          <h4 className="font-medium">Normalized profile (JSON)</h4>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(normalized, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
