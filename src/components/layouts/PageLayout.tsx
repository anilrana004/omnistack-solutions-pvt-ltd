import { ReactNode, Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '@/src/components/ui/WhatsAppButton';
import PreviewBanner from '@/src/components/PreviewBanner';
import { getSiteSettings } from '@/src/lib/sanity.api';
import { getFeatureFlags } from '@/src/lib/feature-flags';
import { isPreviewMode } from '@/src/lib/preview-utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  documentType?: string;
  documentId?: string;
}

async function LayoutContent({ 
  children, 
  className = '',
  showHeader = true,
  showFooter = true,
  documentType,
  documentId,
}: PageLayoutProps) {
  // Get site settings and feature flags
  const [settingsResult, featureFlags] = await Promise.all([
    getSiteSettings(),
    getFeatureFlags(),
  ]);

  const settings = settingsResult.data;
  const preview = isPreviewMode();

  // Check maintenance mode
  if (settings?.maintenanceMode?.isEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Site Under Maintenance
          </h1>
          <p className="text-gray-600 max-w-md">
            {settings.maintenanceMode.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Preview Banner */}
      {preview && (
        <PreviewBanner
          isPreview={preview}
          documentType={documentType}
          documentId={documentId}
        />
      )}

      {/* Header */}
      {showHeader && (
        <Header 
          settings={settings}
          className={preview ? 'top-20' : 'top-0'}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer settings={settings} />
      )}

      {/* WhatsApp Button */}
      {featureFlags.enableWhatsApp && settings?.whatsapp?.isEnabled && (
        <WhatsAppButton 
          phoneNumber={settings.whatsapp.phoneNumber}
          message={settings.whatsapp.defaultMessage}
        />
      )}
    </div>
  );
}

export default function PageLayout(props: PageLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600"></div>
      </div>
    }>
      <LayoutContent {...props} />
    </Suspense>
  );
}