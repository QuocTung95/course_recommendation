"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdFolder, MdCheckCircle, MdError } from "react-icons/md";

type NormalizedProfile = any;

type Props = {
  onComplete?: (profileText: string, career: string) => void;
};

export default function ProfileUpload({ onComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [normalized, setNormalized] = useState<NormalizedProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);

  // Toast / Snackbar state
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    text: string;
  }>({
    show: false,
    type: "success",
    text: "",
  });

  const backendBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const showToast = (
    text: string,
    type: "success" | "error" = "success",
    duration = 3500
  ) => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), duration);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Spinner small component
  const Spinner = ({ size = 16 }: { size?: number }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${Math.max(
          2,
          Math.round(size / 6)
        )}px solid rgba(66,72,116,0.15)`,
        borderTopColor: "#424874",
        animation: "spin 1s linear infinite",
      }}
    />
  );

  // CSS keyframes inserted via effect (minimal, self-contained)
  useEffect(() => {
    const id = "pu-spin-style";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.innerHTML = `
        @keyframes spin { to { transform: rotate(360deg);} }
      `;
      document.head.appendChild(s);
    }
  }, []);

  const uploadFile = async () => {
    if (!file) {
      showToast("Vui lòng chọn file trước khi upload", "error");
      return;
    }
    setLoading(true);
    setStatusLabel("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${backendBase}/api/upload-profile`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRawText(res.data.raw_text || "");
      setNormalized(null);
      showToast("Tải lên thành công", "success");
    } catch (err: any) {
      showToast(
        "Upload failed: " + (err?.response?.data?.detail || err.message),
        "error"
      );
    } finally {
      setLoading(false);
      setStatusLabel(null);
    }
  };

  const normalizeOnly = async () => {
    if (!rawText) {
      showToast("Không có nội dung để normalize", "error");
      return;
    }
    setLoading(true);
    setStatusLabel("Normalizing...");
    try {
      const res = await axios.post(`${backendBase}/api/normalize-profile`, {
        profile_text: rawText,
      });
      setNormalized(res.data.normalized_profile || null);
      showToast("Chuẩn hóa thành công", "success");
    } catch (err: any) {
      showToast(
        "Normalize failed: " + (err?.response?.data?.detail || err.message),
        "error"
      );
    } finally {
      setLoading(false);
      setStatusLabel(null);
    }
  };

  const saveNormalized = async () => {
    if (!normalized) {
      showToast(
        "Không có profile đã chuẩn hóa để lưu. Bấm Normalize trước.",
        "error"
      );
      return;
    }
    setLoading(true);
    setStatusLabel("Saving...");
    try {
      const res = await axios.post(`${backendBase}/api/save-profile`, {
        normalized_profile: normalized,
      });
      setNormalized(res.data.normalized_profile || null);
      const savedPath = res.data.saved_path || "";
      showToast("Saved profile", "success");
      const career = res.data.normalized_profile?.CareerGoal || "";
      if (onComplete) onComplete(rawText, career);
    } catch (err: any) {
      showToast(
        "Save failed: " + (err?.response?.data?.detail || err.message),
        "error"
      );
    } finally {
      setLoading(false);
      setStatusLabel(null);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Toast / Snackbar */}
      {toast.show && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            right: 20,
            top: 24,
            backgroundColor: "#A6B1E1",
            color: "#424874",
            padding: "12px 16px",
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(66,72,116,0.12)",
            display: "flex",
            gap: 10,
            alignItems: "center",
            zIndex: 60,
            animation: "toast-in .25s ease",
          }}
        >
          {toast.type === "success" ? (
            <MdCheckCircle size={20} color="#424874" />
          ) : (
            <MdError size={20} color="#424874" />
          )}
          <div style={{ fontWeight: 600 }}>{toast.text}</div>
        </div>
      )}

      <h3
        style={{
          color: "#424874",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        Upload profile (pdf / docx / txt)
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 12,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 12,
            backgroundColor: "#F4EEFF",
            borderRadius: 10,
            border: "1px solid #A6B1E1",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: "#A6B1E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#424874",
            }}
          >
            <MdFolder size={22} color="#424874" />
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#424874",
              }}
            >
              {file ? file.name : "Chọn file"}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#424874",
                opacity: 0.85,
              }}
            >
              {file
                ? `${(file.size / 1024).toFixed(1)} KB`
                : "PDF / DOCX / TXT"}
            </div>
          </div>
        </label>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <button
            onClick={uploadFile}
            disabled={!file || loading}
            className="rounded-lg px-3 py-2 font-semibold"
            style={{
              backgroundColor: "#424874",
              color: "#fff",
              opacity: !file || loading ? 0.6 : 1,
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            {loading && statusLabel === "Uploading..." ? <Spinner /> : null}
            <span>
              {statusLabel === "Uploading..."
                ? "Uploading..."
                : "Upload & Scan"}
            </span>
          </button>

          <button
            onClick={normalizeOnly}
            disabled={!rawText || loading}
            className="rounded-lg px-3 py-2 font-semibold"
            style={{
              backgroundColor: "#A6B1E1",
              color: "#424874",
              opacity: !rawText || loading ? 0.6 : 1,
            }}
          >
            {loading && statusLabel === "Normalizing..." ? <Spinner /> : null}
            <span>
              {statusLabel === "Normalizing..." ? "Working..." : "Normalize"}
            </span>
          </button>

          <button
            onClick={saveNormalized}
            disabled={!normalized || loading}
            className="rounded-lg px-3 py-2 font-semibold"
            style={{
              backgroundColor: "#424874",
              color: "#fff",
              opacity: !normalized || loading ? 0.6 : 1,
            }}
          >
            {loading && statusLabel === "Saving..." ? <Spinner /> : null}
            <span>{statusLabel === "Saving..." ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 16,
        }}
      >
        <div>
          <h4
            style={{
              color: "#424874",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Scanned text (you can edit)
          </h4>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              borderRadius: 8,
              padding: 12,
              border: "1px solid #A6B1E1",
              backgroundColor: "#F4EEFF",
              color: "#424874",
            }}
            placeholder="Scanned content will appear here for review..."
          />
        </div>

        <div>
          <h4
            style={{
              color: "#424874",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Preview / Normalized JSON
          </h4>
          {normalized ? (
            <pre
              style={{
                backgroundColor: "#DCD6F7",
                padding: 12,
                borderRadius: 8,
                overflow: "auto",
                height: 240,
                color: "#424874",
              }}
            >
              {JSON.stringify(normalized, null, 2)}
            </pre>
          ) : (
            <div
              style={{
                height: 240,
                backgroundColor: "#F4EEFF",
                border: "1px dashed #A6B1E1",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#424874",
              }}
            >
              Không có dữ liệu đã chuẩn hóa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
