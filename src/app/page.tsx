import SaveEditor from '@/components/save-editor'
import { Separator } from "@/components/ui/separator"
import VersionHistory from '@/components/version-history'

export default function Page() {
  return (
    <>
      <SaveEditor />
      <Separator />
      <VersionHistory />
    </>
  )
}
