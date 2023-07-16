document.getElementById("file").addEventListener("change", handle, false);

function handle(event) {
  var file = event.target.files[0];
	
  read(file)
    .then(content => { 
      document.getElementById("content").value = content;
      
      var maps = content
      .replace(/[^-0-9a-zA-Z\u0410-\u042F\u0430-\u044F\s]/g, "")
        .split(/\s+/)
          .reduce(function(map, word) {
            map[word] = (map[word]||0)+1;
            return map;
          }, Object.create(null));

      content_reduced = 
        JSON.stringify(maps)
          .replace(/[^-0-9a-zA-Z\u0410-\u042F\u0430-\u044F\s\d:,]/g, "")
            .replace(/,/g, "\n")
              .replace(/:/g, " ");
      document.getElementById("content_reduced").value = content_reduced;

      download(content_reduced, file.name);
    })
      .catch(error => console.log(error))
}

function read(file) {
	const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  })
}

function download(content_reduced, filename) {
  const download = document.getElementById("download");
  
  download.innerText = filename.replace(".txt", "_reduced.txt");
  download.style.display = "block";
  download.onclick = () => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content_reduced));
    element.setAttribute('download', download.innerText);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
}