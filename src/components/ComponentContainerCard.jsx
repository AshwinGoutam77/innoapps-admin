import Link from 'next/link';
import { Card, CardBody, CardHeader } from 'react-bootstrap';
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const ComponentContainerCard = ({
  title,
  description,
  children,
  btn,
  exportData,
  onClick,
  backBtn
}) => {
  const handleBack = () => {
    // window.close()
  }
  return <Card>
    <CardHeader className="d-flex align-items-center justify-content-between border-0 border-bottom border-dashed">
      <h4 className="header-title">{title}</h4>
      {btn && <Link href="/add-blogs" className='btn btn-primary rounded-pill'>Add Blogs</Link>}
      {exportData && <button className='btn btn-primary rounded-pill' onClick={() => onClick()}>Export</button>}
      {backBtn && <Link href="/blogs" onClick={handleBack} className='d-flex align-items-center'><IconifyIcon icon="tabler:chevron-left" /> Back</Link>}
    </CardHeader>
    <CardBody>
      {description && <p className="text-muted">{description}</p>}
      {children}
    </CardBody>
  </Card>;
};
export default ComponentContainerCard;