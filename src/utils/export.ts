import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import writeExcelFile from 'write-excel-file/browser'

export type ExportRow = Record<string, string | number>

export const exportElementToPdf = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#f8fafc' })
  const image = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'pt', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = (canvas.height * (pageWidth - 40)) / canvas.width
  pdf.addImage(image, 'PNG', 20, 20, pageWidth - 40, pageHeight)
  pdf.save(filename)
}

export const exportRowsToExcel = async (rows: ExportRow[], filename: string) => {
  if (!rows.length) {
    throw new Error('No data available to export.')
  }
  const headers = Object.keys(rows[0] ?? {})
  const data = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))]
  await writeExcelFile(data).toFile(filename)
}
