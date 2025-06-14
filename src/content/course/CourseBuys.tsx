
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import ComponentCard from '../../components/common/ComponentCard'
import BasicTableOne from '../../components/tables/BasicTables/BasicTableOne'

const CourseBuys = () => {
  return (
    <>
    
     <PageMeta
        title="Eduport Admin | Course Payments"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Course Payments" />
      <div className="space-y-6">
        <ComponentCard title="Course Payments">
          <BasicTableOne />
        </ComponentCard>
      </div>
    
    </>
  )
}

export default CourseBuys