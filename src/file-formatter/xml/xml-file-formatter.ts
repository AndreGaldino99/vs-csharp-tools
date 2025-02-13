import fs from 'fs';
import xmlFormatter from 'xml-formatter';

const XmlFileFormatter = (filePath: string)=>{
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      
      const formattedXml = xmlFormatter(data, {
        indentation: '  ', 
        lineSeparator: '\n', 
        collapseContent:true
      });
      
      fs.writeFile(filePath, formattedXml, 'utf8', (err) => {
        if (err) {
          console.error('Error saving file:', err);
          return;
        }
    
        console.log('.csproj file formatted successfully!');
      });
    });
};

export {XmlFileFormatter};