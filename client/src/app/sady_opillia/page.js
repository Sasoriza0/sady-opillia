import Link from "next/link";
import Image from 'next/image'

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8 place-content-center mt-12 ">
      <Link href={'sady_opillia/products/apple'} className="no-link-style">
        <div className="type-item">
          <Image className="object-cover"
            src='/img/apple.jpg'
            height={150}
            width={150}
          />
          <div className="type-item-text">
              САДЖАНЦІ ЯБЛУНІ
          </div>
        </div>
      </Link>
      <Link href={'sady_opillia/products/pear'} className="no-link-style">
        <div className="type-item">
          <Image className="object-cover"
            src='/img/pear.jfif'
            height={150}
            width={150}
          />
          <div className="uper type-item-text">
              САДЖАНЦІ ГРУШІ
          </div>
        </div>
      </Link>
      <Link href={'sady_opillia/products/cherry'} className="no-link-style">
        <div className="type-item">
          <Image className="object-cover"
            src='/img/cherry.jfif'
            height={150}
            width={150}
          />
          <div className="type-item-text">
              САДЖАНЦІ ЧЕРЕШНІ
          </div>
        </div>
      </Link>
      <Link href={'sady_opillia/products/peach'} className="no-link-style">
        <div className="type-item">
          <Image className="object-cover"
            src='/img/peach.jpeg'
            height={150}
            width={150}
          />
          <div className="type-item-text">
              САДЖАНЦІ ПЕРСИКА
          </div>
        </div>
      </Link>
      <Link href={'sady_opillia/products/apricot'} className="no-link-style">
        <div className="type-item">
          <Image className="object-cover"
            src='/img/apricot.jfif'
            height={150}
            width={150}
          />
          <div className="type-item-text">
              САДЖАНЦІ АБРИКОСА
          </div>
        </div>
      </Link>
      <Link href={'sady_opillia/products/nectarine'} className="no-link-style">
        <div className="type-item">
          <Image className="object-cover"
            src='/img/nectarine.jfif'
            height={150}
            width={150}
          />
          <div className="type-item-text">
              САДЖАНЦІ НЕКТАРИНА
          </div>
        </div>
      </Link>
    </div>
  );
}
