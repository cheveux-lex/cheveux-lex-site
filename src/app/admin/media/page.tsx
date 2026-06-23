"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";

export default function AdminMediaPage() {
  return (
    <>
      <AdminPageHeader
        title="Media"
        description="Media Manager is disabled."
      />
      <AdminCard>
        <p className="text-sm text-taupe">
          Media Manager is disabled. Edit images from Site Settings, Services,
          Stylists, Gallery, and Videos.
        </p>
      </AdminCard>
    </>
  );
}
