import React from 'react'
import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

function PDFComponent() {
    return (
        <Document Document >
            <Page size="A4">
                <View>
                    <Text>Game Data</Text>
                    <Table>
                        {/* Render your table content here */}
                    </Table>
                </View>
            </Page>
        </Document>
    )
}

export default PDFComponent

