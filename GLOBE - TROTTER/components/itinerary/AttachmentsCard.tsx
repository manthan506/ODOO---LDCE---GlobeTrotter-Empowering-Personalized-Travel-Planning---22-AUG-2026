'use client';

import { useState } from 'react';
import { Paperclip, Plus, Trash2, ExternalLink, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { Attachment } from '@/types';

interface AttachmentsCardProps {
  stopId: string;
  attachments?: Attachment[];
  onUpdated: () => void;
}

export function AttachmentsCard({
  stopId,
  attachments = [],
  onUpdated,
}: AttachmentsCardProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setSubmitting(true);
    const updated = [
      ...attachments,
      {
        name,
        url: url.startsWith('http') ? url : `https://${url}`,
        type: 'link',
      },
    ];

    try {
      const res = await fetch(`/api/stops/${stopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachments: updated }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Document link attached');
        setName('');
        setUrl('');
        setShowAdd(false);
        onUpdated();
      }
    } catch {
      toast.error('Failed to attach document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    try {
      const res = await fetch(`/api/stops/${stopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachments: updated }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Attachment removed');
        onUpdated();
      }
    } catch {
      toast.error('Failed to remove attachment');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <Paperclip size={16} />
          </div>
          <span className="text-xs font-bold text-slate-900">Attachments & Documents</span>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus size={14} /> Add Link
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Document label (e.g. Train E-Ticket, Museum Voucher)"
            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none"
          />
          <input
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste document / drive URL (e.g. drive.google.com/...)"
            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none font-mono"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700"
            >
              {submitting ? 'Saving...' : 'Attach'}
            </button>
          </div>
        </form>
      )}

      {attachments.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-1">No documents or links attached yet.</p>
      ) : (
        <div className="space-y-1.5">
          {attachments.map((att, i) => (
            <div
              key={att.id || i}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs"
            >
              <a
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-semibold text-blue-600 hover:underline min-w-0 pr-2"
              >
                <FileText size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{att.name}</span>
                <ExternalLink size={11} className="text-slate-400 flex-shrink-0" />
              </a>

              <button
                onClick={() => handleDelete(i)}
                className="text-slate-400 hover:text-red-600 p-1"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
