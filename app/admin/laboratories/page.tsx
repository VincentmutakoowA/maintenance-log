'use client'
import { useEffect, useState } from "react"
import { getAllLaboratoriesAction, addLaboratoryAction, deleteLaboratoryAction } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/SubmitButton"
import { useActionState } from "react"
import { PenBox } from "lucide-react"

export default function Laboratories() {

    const [laboratories, setLaboratories] = useState<any[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const initialState = { success: false, error: null }
    const [editingLab, setEditingLab] = useState<any | null>(null)

    useEffect(() => {
        const fetchLaboratories = async () => {
            setLoading(true)
            const labs = await getAllLaboratoriesAction()
            if (labs) setLaboratories(labs)
            setLoading(false)
        }
        fetchLaboratories()
    }, [])

    return (
        <div className="w-full max-w-6xl ">
            {!showAddForm &&
                <Card>
                    {loading &&
                        (<CardContent className="aspect-square sm:aspect-video flex items-center justify-center">
                            <Spinner />
                        </CardContent>)
                    }
                    {!loading && laboratories && laboratories.length === 0 &&
                        <CardContent className="aspect-square sm:aspect-video flex flex-col gap-4 items-center justify-center">
                            <p>No laboratories found.</p>
                            <div className="flex flex-col items-center">
                                <Button onClick={() => setShowAddForm(true)}>Add Laboratory</Button>
                            </div>
                        </CardContent>
                    }
                    {!loading && laboratories && laboratories.length > 0 && (
                        <div className="mx-4">
                            <div className="flex justify-end mb-4">
                                <Button onClick={() => { setShowAddForm(true) }}>Add Laboratory</Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {laboratories.map(lab => (
                                    <Card className="border border-primary"
                                        key={lab.id}>
                                        <CardHeader className="relative">
                                            <CardTitle>{lab.lab_name}</CardTitle>
                                            <PenBox className="absolute top-0 right-3 cursor-pointer" size={18} onClick={() => { setShowAddForm(true); setEditingLab(lab) }} />
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            }
            {showAddForm && <AddLaboratoryForm lab={editingLab} onClose={() => {
                setShowAddForm(false)
                setEditingLab(null)
            }}
                onSaved={
                    async () => {
                        setLoading(true)
                        const labs = await getAllLaboratoriesAction()
                        if (labs) setLaboratories(labs)
                        setLoading(false)
                    }
                }
            />}
        </div>
    )

    function AddLaboratoryForm({
        lab,
        onClose,
        onSaved
    }: {
        lab?: any
        onClose: () => void
        onSaved: () => void
    }) {
        const [state, formAction] = useActionState(addLaboratoryAction, initialState)

        return (
            <Card className="p-4 aspect-square sm:aspect-video flex items-center justify-center">
                <div className="w-full max-w-sm mx-auto">
                    <h2 className="text-lg font-medium mb-4">
                        {lab ? "Edit Laboratory" : "Add Laboratory"}
                    </h2>

                    <form action={formAction}>
                        <input type="hidden" name="id" value={lab?.id ?? ""} />

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                                type="text"
                                name="name"
                                defaultValue={lab?.lab_name ?? ""}
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <SubmitButton />
                            <Button variant="outline" type="button" onClick={onClose}>
                                Cancel
                            </Button>

                            {lab && (
                                <div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={async () => {
                                            await deleteLaboratoryAction(lab.id)
                                            await onSaved()
                                            onClose()
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>

                        {state?.success && (
                            <div className="mt-4">
                                <p className="text-green-600">
                                    {lab ? "Laboratory updated!" : "Laboratory added!"}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        await onSaved()
                                        onClose()
                                    }}
                                >
                                    Back to list
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </Card>
        )
    }
}