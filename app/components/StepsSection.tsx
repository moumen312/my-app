export default function StepsSection()  {
  const leftSteps = [
    {
      number: "01",
      title: "Browse",
      desc: "Explore products and categories\nFind the best deals and latest tech",
    },
    {
      number: "02",
      title: "Order",
      desc: "Add to cart and confirm your purchase\nReview your items and choose your payment method",
    },
    {
      number: "03",
      title: "Receive",
      desc: "Get your order delivered\nTrack your order and enjoy fast delivery",
    },
  ];

  const rightSteps = [
    {
      number: "01",
      title: "Add Products",
      desc: "Upload and manage your products\nEasily update prices, images, and descriptions",
    },
    {
      number: "02",
      title: "Manage Orders",
      desc: "Track and handle customer orders\nStay organized and respond to customer needs",
    },
    {
      number: "03",
      title: "Grow Sales",
      desc: "Reach more customers and increase sales\nUse the platform to boost visibility and performance",
    },
  ];

  return (
    <section className=" text-white py-20 px-6">
      <div className=" ml-[10%] max-w-7xl mx-auto grid grid-cols-2 gap-[120] space-y-[100] mt-[10%] mr-[10%]">
        
        {/* LEFT */}
        <div className="grid gap-y-[10]">
          {leftSteps.map((step, i) => (
            <StepItem key={i} {...step} />
          ))}
        </div>

        {/* RIGHT */}
        <div className="grid gap-y-[10]">
          {rightSteps.map((step, i) => (
            <StepItem key={i} {...step} />
          ))}
        </div>

      </div>
    </section>
  );
}
type StepItemProps = {
  number: string;
  title: string;
  desc: string;
};
function StepItem({ number, title, desc }: StepItemProps) {
  return (
    <div className="flex items-start gap-6 mb-[10] rounded-lg border-b border-gray-800
  pb-[20]    "style={{borderColor: "#1E293B" }}>
      
      {/* Number */}
      <div className="min-w-[60] h-[60] flex items-center justify-center rounded-[40%]
 border bg-[#0F172AE5] border-blue-500 text-blue-400 font-semibold" style={{color: "#60A5FA" }}>
        {number}
      </div>

      {/* Text */}
      <div>
        <h3 className="ml-[10%] text-xl font-semibold mb-2">{title}</h3>
        <p className="ml-[10%] text-gray-400 whitespace-pre-line w-[400px]">
          {desc}
        </p>
      </div>
      
    </div>
    
  );
}