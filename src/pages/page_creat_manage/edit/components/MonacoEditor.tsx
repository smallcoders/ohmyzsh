import { memo, FC, useRef } from 'react'
import MonacoEditor from 'react-monaco-editor';

interface Props {
  value: string
  height?: string | number
  theme?: string
  language?: string
  readonly?: boolean
  onChange?: (value: string) => void
}

const MonacoEditorModal: FC<Props> = (props) => {
  const { value, language, height, theme } = props
  const editorRef = useRef<HTMLDivElement>(null)
  return(
    <div ref={editorRef} style={{ height, border: '1px solid lightgrey' }} >
      <MonacoEditor
        height={height}
        language={language}
        theme={theme}
        value={value}
      />
    </div>
  )
}

MonacoEditorModal.defaultProps = {
  height: '100%',
  theme: 'vs',
  language: undefined,
  onChange: undefined,
  readonly: false
}

export default memo(MonacoEditorModal)
