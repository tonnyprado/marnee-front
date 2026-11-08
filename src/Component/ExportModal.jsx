import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileDown, FileText, FileType, Download } from 'lucide-react';
import jsPDF from 'jspdf';

/**
 * ExportModal - Modal to export conversation in different formats
 */
export default function ExportModal({ isOpen, onClose, conversation, messages }) {
  const [format, setFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const formats = [
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Portable document format' },
    { id: 'md', name: 'Markdown', icon: FileType, description: 'For developers & notes' },
    { id: 'txt', name: 'Plain Text', icon: FileDown, description: 'Simple text file' },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(64, 8, 109); // #40086d
    doc.text('Marnee Conversation', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exported on ${new Date().toLocaleDateString()}`, 20, 28);

    let y = 40;

    messages.forEach((msg, index) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      // Sender
      doc.setFontSize(10);
      doc.setTextColor(msg.role === 'user' ? 0 : 64, msg.role === 'user' ? 0 : 8, msg.role === 'user' ? 0 : 109);
      doc.text(msg.role === 'user' ? 'You' : 'Marnee', 20, y);

      // Time
      const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(time, 190, y, { align: 'right' });

      y += 5;

      // Message content
      doc.setFontSize(10);
      doc.setTextColor(0);
      const lines = doc.splitTextToSize(msg.content, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 10;
    });

    doc.save(`marnee-conversation-${Date.now()}.pdf`);
  };

  const exportToMarkdown = () => {
    let content = `# Marnee Conversation\n\n`;
    content += `Exported on ${new Date().toLocaleDateString()}\n\n`;
    content += `---\n\n`;

    messages.forEach((msg) => {
      const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      content += `### ${msg.role === 'user' ? '👤 You' : '🤖 Marnee'} - ${time}\n\n`;
      content += `${msg.content}\n\n`;
      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marnee-conversation-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToText = () => {
    let content = `Marnee Conversation\n`;
    content += `Exported on ${new Date().toLocaleDateString()}\n\n`;
    content += `${'='.repeat(50)}\n\n`;

    messages.forEach((msg) => {
      const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      content += `[${msg.role === 'user' ? 'You' : 'Marnee'}] - ${time}\n`;
      content += `${msg.content}\n\n`;
      content += `${'-'.repeat(50)}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marnee-conversation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      switch (format) {
        case 'pdf':
          exportToPDF();
          break;
        case 'md':
          exportToMarkdown();
          break;
        case 'txt':
          exportToText();
          break;
        default:
          break;
      }

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
      alert('Failed to export. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-[#40086d]" />
                <h3 className="font-bold text-gray-900">Export Conversation</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Export {messages.length} messages to your preferred format
              </p>

              {/* Format Selection */}
              <div className="space-y-2">
                {formats.map((fmt) => {
                  const Icon = fmt.icon;
                  return (
                    <motion.button
                      key={fmt.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormat(fmt.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        format === fmt.id
                          ? 'border-[#40086d] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          format === fmt.id ? 'text-[#40086d]' : 'text-gray-500'
                        }`}
                      />
                      <div className="flex-1 text-left">
                        <div
                          className={`text-sm font-semibold ${
                            format === fmt.id ? 'text-[#40086d]' : 'text-gray-900'
                          }`}
                        >
                          {fmt.name}
                        </div>
                        <div className="text-xs text-gray-500">{fmt.description}</div>
                      </div>
                      {format === fmt.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-[#40086d] rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#40086d] to-[#2d0550] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
