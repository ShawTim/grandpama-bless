import html2canvas from 'html2canvas';
import MediumEditor from "medium-editor";

const MediumEditorColorButtons = require('medium-editor-colorpicker-buttons').get(MediumEditor);
const TextColorButtonClass = MediumEditorColorButtons.TextColorButtonClass

const convertImage = () => {
  html2canvas($(".image-container").get(0), {
    // TODO: i completely have no ideas why i need this hack.
    width: 799,
    x: 527,
  }).then((canvas) => $(".download-link").attr("href", canvas.toDataURL("image/png")));
};

const setDraggableContainer = (element) => $(element).draggable({
  containment: "parent",
  cancel: ".text-editor",
  stop: () => convertImage(),
});

const setResizableEditor = (element) => (element).resizable({
  containment: $(".image-container"),
  autoHide: true,
  handles: "n, e, s, w, ne, se, sw, nw",
});

const setBackground = (img) => {
  $(".image-container").css("background-image", `url(${img})`);
  convertImage();
};

const createEditor = (editor) => {
  const me = new MediumEditor(editor, {
    spellcheck: false,
    toolbar: {
      buttons: [{
        name: 'h3',
        action: 'append-h3',
        aria: '巨字型',
        tagNames: ['h3'],
        contentDefault: '<b>巨</b>',
      }, {
        name: 'h4',
        action: 'append-h4',
        aria: '大字型',
        tagNames: ['h4'],
        contentDefault: '<b>大</b>',
      }, {
        name: 'h5',
        action: 'append-h5',
        aria: '中字型',
        tagNames: ['h5'],
        contentDefault: '<b>中</b>',
      }, {
        name: 'h6',
        action: 'append-h6',
        aria: '小字型',
        tagNames: ['h6'],
        contentDefault: '<b>小</b>',
      }, {
        name: 'italic',
        action: 'italic',
        aria: '斜體',
        tagNames: ['i', 'em'],
        style: {
          prop: 'font-style',
          value: 'italic'
        },
        useQueryState: true,
        contentDefault: '<b><i>斜</i></b>',
      }, {
        name: 'underline',
        action: 'underline',
        aria: '底線',
        tagNames: ['u'],
        style: {
          prop: 'text-decoration',
          value: 'underline'
        },
        useQueryState: true,
        contentDefault: '<b><u>底</u></b>',
      }, 'textcolor'],
    },
    extensions: {
			textcolor: new TextColorButtonClass()
    }
  });
  $(editor).blur((event) => {
    convertImage();
    if (!event.target.innerText || !event.target.innerText.replace(/\n/g, "")) {
      me.destroy();
      $(editor).parent().remove();
    }
  });

  return me;
};

$(function() {
  setDraggableContainer($(".text-container"));
  setResizableEditor($(".text-editor")).each((i, editor) => {
    createEditor(editor);
  });
  $(".add-text-button button").click(() => {
    const container = $("<div></div>").addClass("text-container");
    const editor = $("<div></div>").addClass("text-editor").text("認同請分享");
    container.append(editor);
    setDraggableContainer(container);
    createEditor(setResizableEditor(editor));
    $(".image-container").append(container);
  });
  $(".image-picker img").click((e) => {
    $(".image-picker img").removeClass("selected");
    $(e.target).addClass("selected");
    setBackground($(e.target).attr("src"));
  });
  $("#upload-button").change((e) => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ((f) => {
        $(".image-picker img").removeClass("selected");
        return (e) => setBackground(e.target.result);
      })(file);
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
    }
  });
  convertImage();
});
