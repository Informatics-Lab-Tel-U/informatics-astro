import { Node, mergeAttributes } from "@tiptap/core";

const ONEDRIVE_CDN_ICON =
  "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/microsoft-onedrive/default.svg";

export const AttachmentNode = Node.create({
  name: "attachment",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      title: {
        default: "Lampiran Dokumen",
        parseHTML: (element) =>
          element.getAttribute("data-title") || element.getAttribute("title") || "Lampiran Dokumen",
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
      fileType: {
        default: "Document",
        parseHTML: (element) =>
          element.getAttribute("data-file-type") || element.getAttribute("filetype") || "Document",
        renderHTML: (attributes) => ({
          "data-file-type": attributes.fileType,
        }),
      },
      downloadUrl: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-download-url") || element.getAttribute("downloadurl") || "",
        renderHTML: (attributes) => ({
          "data-download-url": attributes.downloadUrl,
        }),
      },
      driveType: {
        default: "onedrive", // 'onedrive' | 'drive'
        parseHTML: (element) =>
          element.getAttribute("data-drive-type") ||
          element.getAttribute("drivetype") ||
          "onedrive",
        renderHTML: (attributes) => ({
          "data-drive-type": attributes.driveType,
        }),
      },
      buttonText: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-button-text") || element.getAttribute("buttontext") || "",
        renderHTML: (attributes) => ({
          "data-button-text": attributes.buttonText,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="attachment-card"]',
        getAttrs: (element: any) => ({
          title:
            element.getAttribute("data-title") ||
            element.getAttribute("title") ||
            "Lampiran Dokumen",
          fileType:
            element.getAttribute("data-file-type") ||
            element.getAttribute("filetype") ||
            "Document",
          downloadUrl:
            element.getAttribute("data-download-url") || element.getAttribute("downloadurl") || "",
          driveType:
            element.getAttribute("data-drive-type") || element.getAttribute("drivetype") || "drive",
          buttonText:
            element.getAttribute("data-button-text") || element.getAttribute("buttontext") || "",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const title = HTMLAttributes.title || HTMLAttributes["data-title"] || "Lampiran Dokumen";
    const fileType = HTMLAttributes.fileType || HTMLAttributes["data-file-type"] || "Document";
    let downloadUrl = HTMLAttributes.downloadUrl || HTMLAttributes["data-download-url"] || "#";
    if (downloadUrl !== "#" && !/^(https?:\/\/|\/|mailto:)/i.test(downloadUrl)) {
      downloadUrl = "about:blank"; // sanitize invalid protocols (e.g., javascript:)
    }
    const driveTypeAttr = HTMLAttributes.driveType || HTMLAttributes["data-drive-type"] || "drive";
    const isOneDrive =
      driveTypeAttr === "onedrive" ||
      downloadUrl.includes("onedrive") ||
      downloadUrl.includes("1drv.ms") ||
      downloadUrl.includes("sharepoint");

    const buttonText =
      HTMLAttributes.buttonText || HTMLAttributes["data-button-text"] || "Buka Link";

    const iconSpec = isOneDrive
      ? [
          "img",
          {
            src: ONEDRIVE_CDN_ICON,
            alt: "OneDrive",
            style:
              "margin: 0 !important; padding: 0 !important; display: block !important; width: 14px !important; height: 14px !important; object-fit: contain !important;",
          },
        ]
      : [
          "svg",
          {
            width: "15",
            height: "15",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }],
          ["polyline", { points: "15 3 21 3 21 9" }],
          ["line", { x1: "10", y1: "14", x2: "21", y2: "3" }],
        ];

    const linkAttrs: Record<string, string> = {
      href: downloadUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      class: "attachment-download-btn",
    };

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "attachment-card",
        "data-title": title,
        "data-file-type": fileType,
        "data-download-url": downloadUrl,
        "data-drive-type": driveTypeAttr,
        "data-button-text": buttonText,
        class: "attachment-card-wrapper",
      }),
      [
        "div",
        { class: "attachment-card-left" },
        [
          "div",
          { class: "attachment-icon-box" },
          [
            "svg",
            {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
            },
            [
              "path",
              { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" },
            ],
            ["polyline", { points: "14 2 14 8 20 8" }],
            ["line", { x1: "16", y1: "13", x2: "8", y2: "13" }],
            ["line", { x1: "16", y1: "17", x2: "8", y2: "17" }],
          ],
        ],
        [
          "div",
          { class: "attachment-info" },
          ["span", { class: "attachment-title" }, title],
          ["span", { class: "attachment-meta" }, fileType],
        ],
      ],
      [
        "div",
        { class: "attachment-card-right" },
        ["a", linkAttrs, iconSpec, ["span", {}, buttonText]],
      ],
    ];
  },
});
