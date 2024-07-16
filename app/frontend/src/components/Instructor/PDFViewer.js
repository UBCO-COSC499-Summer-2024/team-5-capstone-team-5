import { useEffect, useRef } from "react";
import PSPDFKit from "pspdfkit";

const PDFViewer = ({ documentUrl }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const loadPdf = async () => {
      try {
        console.log("Loading PDF from:", documentUrl);

        await PSPDFKit.load({
          container,
          document: documentUrl,
          baseUrl: `${window.location.origin}/pspdfkit-lib/`, // Ensure this is correct
          licenseKey: 'bVokaUl6HlFBZDXwKap8roEs0ElgE6AdHEYW0d6l8YHUezahrqrIs72q9KGkW5EaFO5AldQmOHn7z8293OF3DlRrUkGXc12i9QxBrH8R7xJ50RHkCoiLpFnyd276pnd3pLRRdWlZ8khIvDc10gdlDdsNdBWre7ijHbt6CcwTKjIYAGl5waU4KY2axvadDHAo3qPE5099JC9BLw', // Add your license key here
          disableWebAssemblyStreaming: true,
        });
        console.log("PDF loaded successfully from:", documentUrl);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();

    return () => {
      if (PSPDFKit) {
        PSPDFKit.unload(container);
      }
    };
  }, [documentUrl]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default PDFViewer;
