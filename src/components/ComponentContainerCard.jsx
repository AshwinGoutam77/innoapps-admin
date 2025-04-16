import Link from 'next/link';
import { Card, CardBody, CardHeader } from 'react-bootstrap';
const ComponentContainerCard = ({
  title,
  description,
  children,
  btn,
}) => {
  return <Card>
    <CardHeader className="d-flex align-items-center justify-content-between border-0 border-bottom border-dashed">
      <h4 className="header-title">{title}</h4>
      {btn && <Link href="/add-blogs" className='btn btn-primary rounded-pill'>Add Blogs</Link>}
    </CardHeader>
    <CardBody>
      {description && <p className="text-muted">{description}</p>}
      {children}
    </CardBody>
  </Card>;
};
export default ComponentContainerCard;