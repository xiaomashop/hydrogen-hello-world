import { Link, useLocation, useSearchParams, useTransition } from "@remix-run/react";

export default function ProductOptions({options}) {
    // pathname and search will be used to build option URLs
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();
  const transition = useTransition();
  console.log("currentSearchParams",currentSearchParams)

  
  // Update the in-flight request data from the 'transition' (if available)
  // to create an optimistic UI that selects a link before the request completes
  const searchParams = transition.location
  ? new URLSearchParams(transition.location.search)
  : currentSearchParams;
  //const searchParams = currentSearchParams;

  //console.log(options)
  return (
    <div className="grid gap-4 mb-6">

      {/* Each option will show a label and option value <Links> */}
      {options.map((option) => {
        if (!option.values.length) {
          return;
        }
        // get the currently selected option value
        const currentOptionVal = searchParams.get(option.name);
        console.log(currentOptionVal)
        return (
          <div
            key={option.name}
            className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
          >
            <h3 className="whitespace-pre-wrap max-w-prose font-bold text-lead min-w-[4rem]">
              {option.name}
            </h3>

            <div className="flex flex-wrap items-baseline gap-4">
              {option.values.map((value) => {
                // Build a URLSearchParams object from the current search string
                const linkParams = new URLSearchParams(search);
                const isSelected = currentOptionVal === value;
                // Set the option name and value, overwriting any existing values
                linkParams.set(option.name, value);
                return (
                  <Link
                    key={value}
                    to={`${pathname}?${linkParams.toString()}`}
                    preventScrollReset
                    replace
                    className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                        isSelected ? 'border-gray-500' : 'border-neutral-50'
                      }`}
                  >
                    {value}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}