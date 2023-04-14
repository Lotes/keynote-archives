import { Action } from "./actions";
import { FileState, InspectorState } from "./states";

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
            chunks: []
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
    default:
      return state;
  }
}