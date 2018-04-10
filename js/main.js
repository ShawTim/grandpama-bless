import html2canvas from 'html2canvas';
import interact from 'interactjs';
import FileSaver from "file-saver";
import MediumEditor from "medium-editor";

const MediumEditorColorButtons = require('medium-editor-colorpicker-buttons').get(MediumEditor);
const TextColorButtonClass = MediumEditorColorButtons.TextColorButtonClass

const setDraggableContainer = (element) => interact(element).draggable({
  restrict: {
    restriction: "parent",
    endOnly: false,
  },
  ignoreFrom: ".text-editor",
  onmove: (e) => {
    const ele = $(e.target);
    const x = parseFloat(ele.attr("data-x") || 0) + e.dx;
    const y = parseFloat(ele.attr("data-y") || 0) + e.dy;
    ele.css({
      transform: `translate(${x}px, ${y}px)`
    }).attr({
      "data-x": x,
      "data-y": y,
    })
  },
});

// TODO: need to see whether jquery resizable can be replaced by interactjs
const setResizableEditor = (element) => $(element).resizable({
  containment: $(".image-container"),
  autoHide: true,
  handles: "n, e, s, w, ne, se, sw, nw",
});

const setBackground = (img) => {
  $(".image-container").css("background-image", `url(${img})`);
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
    if (!event.target.innerText || !event.target.innerText.replace(/\n/g, "")) {
      me.destroy();
      $(editor).parent().remove();
    }
  });

  return me;
};

$(function() {
  setDraggableContainer(".text-container");
  setResizableEditor($(".text-editor")).each((i, editor) => {
    createEditor(editor);
  });
  $(".add-text-button button").click(() => {
    const container = $("<div></div>").addClass("text-container");
    const editor = $("<div></div>").addClass("text-editor").text("認同請分享");
    container.append(editor);
    setDraggableContainer(container.get(0));
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

  $(".convert-button button").click((e) => {
    const isMobile = /Mobi/i.test(navigator.userAgent);
    // TODO: i completely have no ideas why i need this hack.
    const options = isMobile ? {} : { width: 799, x: 527 };
    html2canvas($(".image-container").get(0), options).then((canvas) => {
      canvas.toBlob((blob) => FileSaver.saveAs(blob, "認同請分享.png"));
    });
  });
});
