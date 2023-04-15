import { Action } from "./actions";
import { ChunkState, FileState, InspectorState } from "./states";

export function reducer(state: InspectorState, action: Action): InspectorState {
  switch (action.type) {
    case "add-file":
      const extention = action.path.substring(action.path.lastIndexOf('.') + 1).toLowerCase();
      const fileCommon = {
        status: 'created' as const,
        path: action.path
      };
      let file: FileState;
      switch(extention) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'tiff':
        case 'webp':
          file = {
            ...fileCommon,
            type: 'image',
            url: URL.createObjectURL(new Blob([action.data], { type: 'image/' + extention }))
          };
          break;
        case 'plist':
        case 'xml':
          file = {
            ...fileCommon,
            type: 'xml',
            content: new TextDecoder().decode(action.data)
          };
          break;
        case 'iwa':
          file = {
            ...fileCommon,
            type: 'iwa',
            chunks: [],
            buffer: action.data,
            open: false
          };
          break;
        default:
          file = {
            ...fileCommon,
            type: 'other',
            buffer: action.data
          };
          break;
      }
      return {
        ...state,
        files: [
          ...state.files,
          file
        ],
      };
    case "add-chunk":
      const iwaFile = state.files.find(f => f.path === action.path);
      if (iwaFile && iwaFile.type === 'iwa') {
        const chunk: ChunkState = {
          startAddress: action.startAddress,
          data: action.data
        };
        return {
          ...state,
          files: [
            ...state.files.filter(f => f.path !== action.path),
            {
              ...iwaFile,
              chunks: [
                ...iwaFile.chunks,
                chunk
              ]
            }
          ]
        };
      }
      return state;
    case "toggle-file":
      const fileToToggleIndex = state.files.findIndex(f => f.path === action.path);
      const fileToToggle = state.files[fileToToggleIndex];
      if (fileToToggle && fileToToggle.type === 'iwa') {
        return {
          ...state,
          files: [
            ...state.files.slice(0, fileToToggleIndex),
            {
              ...fileToToggle,
              open: !fileToToggle.open
            },
            ...state.files.slice(fileToToggleIndex + 1)
          ]
        };
      }
      return state;
    default:
      return state;
  }
}