import Layout from "../components/Layout";
import PdfView from "../components/pdf-view";


function PDFViewPage() {
  return (
   <>
   <div>
    <Layout>
        <PdfView/>
    </Layout>
   </div>
   </>
  );
}
export default PDFViewPage;
// <PDFViewer>
//         <MyDocument />
//       </PDFViewer>