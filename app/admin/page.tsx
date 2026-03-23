'use client'

import { Button } from "@/components/ui/button";
import { PRODUCT_OR_SERVICE } from "@/lib/config";
import Link from "next/link";
import { useState } from "react";
import FaultReportForm from "@/app/admin/fault-report-form";
import MaintenanceFlow from "@/app/admin/maintenance-flow";
import ComputerList from "@/app/admin/computer-list";
import Laboratories from "@/app/admin/laboratories/page";

export default function Page() {

  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="w-full max-w-6xl m-auto">
            {/*
            <Link href="/admin/products">
                <Button className="ml-4">Manage {PRODUCT_OR_SERVICE}</Button>
            </Link>
            */}
            <div className="flex gap-4 w-full">
                <Button variant={activeTab === 'home' ? 'default' : 'outline'} onClick={() => setActiveTab('home')}>Home</Button>
                <Button variant={activeTab === 'faults' ? 'default' : 'outline'} onClick={() => setActiveTab('faults')}>Fault Report Form</Button>
                <Button variant={activeTab === 'maintenance' ? 'default' : 'outline'} onClick={() => setActiveTab('maintenance')}>Maintenance Flow</Button>
                <Button variant={activeTab === 'computers' ? 'default' : 'outline'} onClick={() => setActiveTab('computers')}>Computer List</Button>
                <Button variant={activeTab === 'laboratories' ? 'default' : 'outline'} onClick={() => setActiveTab('laboratories')}>Laboratories</Button>
            </div>
            <hr className="my-4" />

            <div className="mt-4">
                {activeTab === 'home' && (
                    <div className=" items-center text-justify p-10 aspect-square md:aspect-video flex flex-col gap-4 items-center justify-center">
                        <h1>Welcome to the Admin Dashboard</h1>
                        <p>Use the buttons above to navigate through different sections of the admin panel.</p>
                    </div>
                )}
                {activeTab === 'faults' && <FaultReportForm />}
                {activeTab === 'maintenance' && <MaintenanceFlow />}
                {activeTab === 'computers' && <ComputerList />}
                {activeTab === 'laboratories' && <Laboratories />}
            </div>
        </div>
  );
}