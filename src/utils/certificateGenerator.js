import { jsPDF } from 'jspdf';

export function generateCertificate({ deviceType, method, timestamp, certificateId }) {
    const doc = new jsPDF();

    // Colors
    const greenColor = [34, 197, 94]; // Green-500
    const grayColor = [107, 114, 128]; // Gray-500

    // Header Section
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, 210, 40, 'F');

    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('EcoWIPE', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Data Sanitization Certificate', 105, 30, { align: 'center' });

    // Certificate Body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF DATA DESTRUCTION', 105, 60, { align: 'center' });

    // Decorative line
    doc.setDrawColor(...greenColor);
    doc.setLineWidth(0.5);
    doc.line(40, 65, 170, 65);

    // Certificate ID
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(`Certificate ID: ${certificateId}`, 105, 75, { align: 'center' });

    // Main Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const contentY = 90;
    doc.text('This is to certify that the following device has been securely wiped:', 20, contentY);

    // Details Box
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.3);
    doc.rect(20, contentY + 5, 170, 50);

    doc.setFont('helvetica', 'bold');
    doc.text('Device Type:', 30, contentY + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(deviceType.toUpperCase(), 70, contentY + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('Wipe Method:', 30, contentY + 25);
    doc.setFont('helvetica', 'normal');
    const methodName = method.charAt(0).toUpperCase() + method.slice(1);
    const methodDetails = method === 'military' ? `${methodName} (DoD 5220.22-M)` :
        method === 'deep' ? `${methodName} (3-pass)` :
            `${methodName} (Single pass)`;
    doc.text(methodDetails, 70, contentY + 25);

    doc.setFont('helvetica', 'bold');
    doc.text('Date & Time:', 30, contentY + 35);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(timestamp).toLocaleString(), 70, contentY + 35);

    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 30, contentY + 45);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...greenColor);
    doc.text('✓ COMPLETED SUCCESSFULLY', 70, contentY + 45);

    // Compliance Statement
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('This wipe operation meets industry standards for data sanitization.', 105, contentY + 65, { align: 'center' });
    doc.text('All data on the device has been permanently and irreversibly destroyed.', 105, contentY + 72, { align: 'center' });

    // Verification Section
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Verification:', 20, contentY + 90);
    doc.text(`Verify this certificate at: https://ecowipe.com/verify/${certificateId}`, 20, contentY + 97);

    // Footer
    doc.setDrawColor(...greenColor);
    doc.setLineWidth(0.5);
    doc.line(20, 260, 190, 260);

    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text('EcoWIPE - Secure Data Sanitization Platform', 105, 270, { align: 'center' });
    doc.text('Generated automatically by EcoWIPE Desktop Agent', 105, 276, { align: 'center' });
    doc.text(`Certificate issued: ${new Date(timestamp).toISOString()}`, 105, 282, { align: 'center' });

    // Green stamp
    doc.setFillColor(34, 197, 94, 20);
    doc.circle(170, 240, 15, 'F');
    doc.setTextColor(...greenColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFIED', 170, 238, { align: 'center' });
    doc.text('SECURE', 170, 244, { align: 'center' });

    // Save the PDF
    doc.save(`EcoWIPE_Certificate_${certificateId}.pdf`);

    return certificateId;
}

// Generate unique certificate ID
export function generateCertificateId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ECW-${timestamp}-${random}`.toUpperCase();
}
