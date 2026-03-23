'use client"'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getAllLaboratoriesAction, addLaboratoryAction } from "../actions"

export default function AddLaboratoryForm() {

    const [labName, setLabName] = useState("")


    const saveLaboratoryAction = async (name: string) => {
        await addLaboratoryAction(name)
        // refresh list
        const labs = await getAllLaboratoriesAction()
        if (labs) setLaboratories(labs)
    }

    return (
        <Card className="p-4 aspect-square sm:aspect-video flex items-center justify-center">
            <div className="w-full max-w-sm mx-auto">
                <h2 className="text-lg font-medium mb-4">Add Laboratory</h2>

                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full border rounded px-3 py-2"
                            value={labName}
                            onChange={(e) => setLabName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" className="px-7">Add</Button>
                        <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>

            </div>
        </Card>
    )
}