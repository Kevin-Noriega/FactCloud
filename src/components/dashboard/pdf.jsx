import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const pdf  = () => {
  const Descargarpdf = async () => {
    const input = document.getElementById("factura-print");
    
    // Validación crítica
    if (!input) {
      console.error("Elemento #factura-print no encontrado");
      alert("No se encontró la factura para imprimir");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: input.scrollWidth,
        height: input.scrollHeight
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`factura_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  return (
    <button
      className="btn btn-light btn-sm me-2"
      onClick={Descargarpdf}
    >
      Descargar
    </button>
  );
};
export default pdf;