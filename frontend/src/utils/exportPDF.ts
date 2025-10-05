import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (data: any[]) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  
  // Add title
  doc.setFontSize(16);
  doc.text('Data Export', 14, 20);
  
  // Prepare the data for the table
  const headers = Object.keys(data[0])
    .filter(key => key !== 'id')
    .map(header => header.charAt(0).toUpperCase() + header.slice(1));
    
  const values = data.map(item => 
    Object.keys(item)
      .filter(key => key !== 'id')
      .map(key => item[key].toString())
  );
  
  // Add the table using autoTable
  autoTable(doc, {
    head: [headers],
    body: values,
    startY: 30,
    margin: { top: 30 },
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  // Save the PDF
  doc.save('data-export.pdf');
};