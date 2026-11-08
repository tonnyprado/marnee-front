import { useState, useEffect } from 'react';
import { FileText, Shield, Save, Eye, Calendar, AlertCircle } from 'lucide-react';
import AdminTransition from '../components/AdminTransition';

export default function LegalDocumentsPage() {
  const [activeTab, setActiveTab] = useState('terms');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Terms of Service state
  const [termsContent, setTermsContent] = useState({
    lastUpdated: 'May 12, 2026',
    content: ''
  });

  // Privacy Policy state
  const [privacyContent, setPrivacyContent] = useState({
    lastUpdated: 'May 12, 2026',
    content: ''
  });

  useEffect(() => {
    // TODO: Fetch current legal documents from API
    // For now, we'll use placeholder text
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    // TODO: Replace with actual API call
    // const response = await getLegalDocuments();

    // Placeholder - in production, this would come from the API
    setTermsContent({
      lastUpdated: 'May 12, 2026',
      content: 'Terms of Service content will be loaded here...'
    });

    setPrivacyContent({
      lastUpdated: 'May 12, 2026',
      content: 'Privacy Policy content will be loaded here...'
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // TODO: Replace with actual API call to save documents
      // await updateLegalDocument(activeTab, {
      //   content: activeTab === 'terms' ? termsContent.content : privacyContent.content,
      //   lastUpdated: new Date().toISOString()
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const now = new Date().toLocaleString();
      setLastSaved(now);

      // Update last updated date
      if (activeTab === 'terms') {
        setTermsContent(prev => ({ ...prev, lastUpdated: now }));
      } else {
        setPrivacyContent(prev => ({ ...prev, lastUpdated: now }));
      }

      alert('Document saved successfully!');
    } catch (error) {
      alert(`Error saving document: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const path = activeTab === 'terms' ? '/terms' : '/privacy';
    window.open(path, '_blank');
  };

  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield }
  ];

  const currentContent = activeTab === 'terms' ? termsContent : privacyContent;
  const currentText = activeTab === 'terms' ? termsContent.content : privacyContent.content;
  const setCurrentText = activeTab === 'terms'
    ? (text) => setTermsContent(prev => ({ ...prev, content: text }))
    : (text) => setPrivacyContent(prev => ({ ...prev, content: text }));

  return (
    <AdminTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-mn-purple" size={32} />
            Legal Documents Management
          </h1>
          <p className="text-gray-600 mt-1">
            Edit and manage Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Important Note</p>
            <p>
              Changes made here will update the legal documents displayed to users.
              Make sure to review all changes carefully and consult with legal counsel
              before publishing updates. Changes take effect immediately upon saving.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-all
                    ${activeTab === tab.id
                      ? 'border-mn-purple text-mn-purple bg-purple-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Document Info Bar */}
          <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Last Updated: {currentContent.lastUpdated}</span>
              </div>
              {lastSaved && (
                <div className="text-sm text-green-600">
                  Saved at {lastSaved}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple-dark transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Text Editor */}
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Content
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Edit the content of the {activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'} below.
                You can use plain text or basic formatting.
              </p>
            </div>

            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              rows={25}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mn-purple focus:border-transparent resize-none font-mono text-sm"
              placeholder={`Enter the ${activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'} content here...`}
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {currentText.length.toLocaleString()} characters
              </div>
              <div className="text-sm text-gray-500">
                Use the Preview button to see how it will appear to users
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Editing Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-mn-purple mt-1">•</span>
              <span>Always preview your changes before saving to ensure proper formatting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mn-purple mt-1">•</span>
              <span>Include the effective date at the top of each document</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mn-purple mt-1">•</span>
              <span>Consult with legal counsel before making significant changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mn-purple mt-1">•</span>
              <span>Notify users of material changes as required by law</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mn-purple mt-1">•</span>
              <span>Keep a record of previous versions for compliance purposes</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminTransition>
  );
}
