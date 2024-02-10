window.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const colorInput = document.getElementById('colorInput');
    const toleranceInput = document.getElementById('toleranceInput');
    const removeColorBtn = document.getElementById('removeColorBtn');
    const applyChangesBtn = document.getElementById('applyChangesBtn');
    const undoChangesBtn = document.getElementById('undoChangesBtn');
    const downloadLink = document.getElementById('downloadLink');
    let ctx;
    let originalImage;
    let imageData;
  
    imageInput.addEventListener('change', handleImageUpload);
    colorInput.addEventListener('change', enableRemoveButton);
    removeColorBtn.addEventListener('click', removeColor);
    applyChangesBtn.addEventListener('click', applyChanges);
    undoChangesBtn.addEventListener('click', undoChanges);
  
    function handleImageUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = function(event) {
        const image = new Image();
        image.onload = function() {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);
          originalImage = new Image();
          originalImage.src = event.target.result;
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          enableRemoveButton();
        };
        image.src = event.target.result;
      };
  
      reader.readAsDataURL(file);
    }
  
    function enableRemoveButton() {
      removeColorBtn.disabled = false;
    }
  
    function removeColor() {
      const colorToRemove = hexToRgb(colorInput.value);
      const tolerance = parseInt(toleranceInput.value);
      const data = imageData.data;
  
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];
  
        if (isSimilarColor(red, green, blue, colorToRemove, tolerance)) {
          data[i + 3] = 0; // Set alpha to 0 to remove the color
        }
      }
  
      ctx.putImageData(imageData, 0, 0);
      enableApplyButton();
      enableUndoButton();
    }
  
    function enableApplyButton() {
      applyChangesBtn.disabled = false;
    }
  
    function enableUndoButton() {
      undoChangesBtn.disabled = false;
    }
  
    function applyChanges() {
      const dataURL = canvas.toDataURL('image/png');
      downloadLink.href = dataURL;
      downloadLink.download = 'modified_image.png';
      downloadLink.click();
    }
  
    function undoChanges() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImage, 0, 0);
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoChangesBtn.disabled = true;
      applyChangesBtn.disabled = true;
      removeColorBtn.disabled = false;
    }
  
    function isSimilarColor(r1, g1, b1, { r, g, b }, tolerance) {
      return (
        Math.abs(r1 - r) <= tolerance &&
        Math.abs(g1 - g) <= tolerance &&
        Math.abs(b1 - b) <= tolerance
      );
    }
  
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    }
  });
  