const { jsPDF } = require('jspdf');

export const TemplatesController = {
    generatePDF: (content, filename) => {

        let doc = new jsPDF('p', 'mm', [1200, 1200]);
        
        let fixTemplate = content.replace(/\s/g, "&nbsp");
        fixTemplate = fixTemplate.replace(/(?<=\w)-(?=\w)/g, "&nbsp");
        fixTemplate += '<div><img style="margin: 10px 0px 0px 100px" src="https://ipfs.io/ipfs/QmQNw5BUgkP9YHbsLUW8gnXoHVeqomsv3j8scnjm6YcFBP"></div>';
        
        doc.html(fixTemplate, {
            callback: function(doc) {
                doc.save(filename);
            },
            x: 10,
            y: 10
        });
    }
}