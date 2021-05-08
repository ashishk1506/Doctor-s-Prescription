

/*function generatePDF() {
    const element = document.getElementById("invoice");

    html2pdf().from(element).save();
    //var worker = html2pdf().from(element).toPDF().save();
    
}*/

window.onload = function() {
    document.getElementById("download")
    .addEventListener("click",() => {
        const invoice = this.document.getElementById("invoice");
        console.log(invoice);
        console.log(window);
        var opt = {
            margin:         1,
            enableLinks:  true ,
            filename:     'text1.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
         html2pdf(invoice, {
            margin:         1,
            enableLinks:  true ,
            filename:     'text1.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
         });
        //var element = document.getElementById("invoice");
        //var doc = html2pdf(element, {return : true});

        //console.log(doc);
        //var worker = html2pdf().from(element).save();
    })
}