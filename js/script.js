document.addEventListener("DOMContentLoaded", event => {
  document.getElementById("file").addEventListener("change", event => {
    const file = event.target.files[0];

    read(file)
      .then(content => { 
        document.getElementById("content").value = content;

        const maps = content
          .replace(/[^-0-9a-zA-Z\u0410-\u042F\u0430-\u044F\s]/g, "")
            .split(/\s+/)
              .reduce((map, word) => {
                if (entry = map.find(entry => entry.key == word)) {
                  entry.value ++;
                  return map;
                }
                map.push({key: word, value: 1});
                return map;
              }, [])
                .sort((a, b) => {
                  if (a.key < b.key) return -1;
                  if (a.key > b.key) return 1;
                  return 0;
                });

        let content_reduced = "";

        for (const map of maps) content_reduced += map.key + " " + map.value + "\n"; 

        document.getElementById("content_reduced").value = content_reduced;

        download(content_reduced, file.name);
      })
        .catch(error => console.log(error));
  });

  function read(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
  }

  function download(content_reduced, filename) {
    const download = document.getElementById("download");
    
    download.innerText = filename.replace(".txt", "_reduced.txt");

    download.style.display = "block";

    download.onclick = () => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content_reduced));
      element.setAttribute('download', download.innerText);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
});