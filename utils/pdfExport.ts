// utils/pdfExport.ts - Updated version with better pagination support
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = async (
  element: HTMLElement,
  filename: string,
  title: string,
  subtitle?: string
): Promise<string> => {
  // Create a new PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const reportDate = new Date().toLocaleDateString();
  
  // Add report header to first page
  addHeader(pdf, title, subtitle, reportDate);
  
  // Function to add header to each page
  function addHeader(pdf: jsPDF, title: string, subtitle?: string, date?: string, pageNumber?: number) {
    pdf.setFontSize(18);
    pdf.text("Pasaydan NGO", pageWidth / 2, 15, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text(title, pageWidth / 2, 25, { align: 'center' });
    
    if (subtitle) {
      pdf.setFontSize(12);
      pdf.text(subtitle, pageWidth / 2, 32, { align: 'center' });
    }
    
    if (date) {
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${date}`, pageWidth / 2, subtitle ? 39 : 35, { align: 'center' });
    }
    
    if (pageNumber) {
      pdf.setFontSize(10);
      pdf.text(`Page ${pageNumber}`, pageWidth - 10, pageHeight - 10, { align: 'right' });
    }
  }

  try {
    // First, break the element down into sections (one per card)
    const sections = Array.from(element.querySelectorAll('.space-y-6 > div'));
    
    if (sections.length === 0) {
      // If no sections found, treat the entire element as one section
      sections.push(element);
    }
    
    let currentPage = 1;
    let yPosition = 45; // Start position after header
    
    // Process each section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      // Capture the section
      const canvas = await html2canvas(section as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200,
      });
      
      // Calculate dimensions
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page
      if (yPosition + imgHeight > pageHeight - 20) {
        pdf.addPage();
        currentPage++;
        addHeader(pdf, title, undefined, undefined, currentPage);
        yPosition = 45; // Reset position after new header
      }
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      
      // Update position for next section
      yPosition += imgHeight + 10; // 10mm spacing between sections
    }
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
    return filename;
  } catch (error) {
    console.error("Error during PDF generation:", error);
    throw error;
  }
};