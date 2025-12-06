import "./styles.css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
// import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { useState } from "react";
import afterFrame from "afterframe";
import { Tooltip as BaseTooltip } from "@base-ui-components/react";
import MuiTooltip from "@mui/material/Tooltip";

function measureInteraction() {
  const startTimestamp = performance.now();

  return {
    end() {
      const endTimestamp = performance.now();
      const duration = endTimestamp - startTimestamp;
      console.log("The interaction took", duration, "ms");
      return duration;
    },
  };
}

const Item = ({ idx }) => <span>{`Item ${idx} - ${Math.random()}`}</span>;

const ItemWithTooltip = ({ idx }) => {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger>
        <Item idx={idx} />
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content className="TooltipContent">
          This is title
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};
// const ItemWithContextMenu = ({ idx }) => {
//   return (
//     <ContextMenuPrimitive.Root>
//       <ContextMenuPrimitive.Trigger asChild>
//         <span>
//           <Item idx={idx} />
//         </span>
//       </ContextMenuPrimitive.Trigger>
//       <ContextMenuPrimitive.Portal>
//         <ContextMenuPrimitive.Content className="TooltipContent">
//           <ContextMenuPrimitive.Item>Back</ContextMenuPrimitive.Item>
//           <ContextMenuPrimitive.Item>Foward</ContextMenuPrimitive.Item>
//           <ContextMenuPrimitive.Item>Reload</ContextMenuPrimitive.Item>
//         </ContextMenuPrimitive.Content>
//       </ContextMenuPrimitive.Portal>
//     </ContextMenuPrimitive.Root>
//   );
// };

const List = () => {
  return (
    <div className="slow-list">
      {Array.from({ length: 2000 }).map((_, idx) => (
        <button key={idx}>
          <Item idx={idx} />
        </button>
      ))}
    </div>
  );
};

const SlowList = () => {
  return (
    <TooltipPrimitive.Provider>
      <div className="slow-list">
        {Array.from({ length: 2000 }).map((_, idx) => (
          <ItemWithTooltip key={idx} idx={idx} />
        ))}
      </div>
    </TooltipPrimitive.Provider>
  );
};

const BaseItemWithTooltip = ({ idx }) => {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger>
        <Item idx={idx} />
      </BaseTooltip.Trigger>

      <BaseTooltip.Portal>
        <BaseTooltip.Positioner>
          <BaseTooltip.Popup className="TooltipContent">
            This is title
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
};

const BaseSlowList = () => {
  return (
    <BaseTooltip.Provider>
      <div className="slow-list">
        {Array.from({ length: 2000 }).map((_, idx) => (
          <BaseItemWithTooltip key={idx} idx={idx} />
        ))}
      </div>
    </BaseTooltip.Provider>
  );
};

const LazyBaseItemWithTooltip = ({ idx }) => {
  const [handle] = useState(() => BaseTooltip.createHandle());
  const [activated, setActivated] = useState(false);

  return (
    <>
      <BaseTooltip.Trigger
        handle={handle}
        onMouseEnter={() => setActivated(true)}
      >
        <Item idx={idx} />
      </BaseTooltip.Trigger>

      {activated ? (
        <BaseTooltip.Root handle={handle}>
          <BaseTooltip.Portal>
            <BaseTooltip.Positioner>
              <BaseTooltip.Popup className="TooltipContent">
                This is title
              </BaseTooltip.Popup>
            </BaseTooltip.Positioner>
          </BaseTooltip.Portal>
        </BaseTooltip.Root>
      ) : (
        false
      )}
    </>
  );
};

const BaseLazyList = () => {
  return (
    <BaseTooltip.Provider>
      <div className="slow-list">
        {Array.from({ length: 2000 }).map((_, idx) => (
          <LazyBaseItemWithTooltip key={idx} idx={idx} />
        ))}
      </div>
    </BaseTooltip.Provider>
  );
};

const MuiItemWithTooltip = ({ idx }) => {
  return (
    <MuiTooltip title="This is title">
      <button>
        <Item idx={idx} />
      </button>
    </MuiTooltip>
  );
};

const MuiSlowList = () => {
  return (
    <div className="slow-list">
      {Array.from({ length: 2000 }).map((_, idx) => (
        <MuiItemWithTooltip key={idx} idx={idx} />
      ))}
    </div>
  );
};

const RenderMeasure = ({ rerender }) => {
  const [lastInteraction, setLastInteraction] = useState(0);

  const handleClick = () => {
    const interaction = measureInteraction();

    // The afterFrame library calls the function
    // when the next frame starts
    afterFrame(() => {
      setLastInteraction(interaction.end());
    });

    rerender();
  };

  return (
    <>
      {lastInteraction ? (
        <div>Last interaction took: ~{Math.round(lastInteraction)}ms</div>
      ) : null}

      <button onClick={handleClick}>Re-render</button>
    </>
  );
};

const Demo = ({ mode }) => {
  const [, setCounter] = useState(0);

  return (
    <>
      <RenderMeasure rerender={() => setCounter((prev) => prev + 1)} />

      {mode === "radix" ? (
        <SlowList />
      ) : mode === "base" ? (
        <BaseSlowList />
      ) : mode === "base-lazy" ? (
        <BaseLazyList />
      ) : mode === "material-ui" ? (
        <MuiSlowList />
      ) : (
        <List />
      )}
    </>
  );
};

export default function App() {
  const [mode, setMode] = useState("radix");

  return (
    <div className="App">
      <h1>Tooltip performance demo</h1>
      <p>Click "Re-render" and see how long the interaction takes </p>
      <p>
        This demo was created back in 2023 to test how big is the impact of the
        Tooltip on the performance. Recently base-ui was released so I wanted to
        test how it performs.
      </p>
      <p>
        Heare are the results I see on my MacBook Pro M2 Max with production
        build and 4x CPU throttling:
      </p>

      <table className="performance-table">
        <thead>
          <tr>
            <th>Mode</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Radix</td>
            <td>250-280ms</td>
          </tr>
          <tr>
            <td>Base UI</td>
            <td>600-700ms</td>
          </tr>
          <tr>
            <td>Base UI - detached with lazy activation</td>
            <td>200ms</td>
          </tr>
          <tr>
            <td>No tooltips</td>
            <td>80ms</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: "1rem" }}>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="radix">Radix</option>
          <option value="base">Base UI</option>
          <option value="base-lazy">Base UI - lazy activation</option>
          <option value="material-ui">Material UI</option>
          <option value="list">No tooltips</option>
        </select>
      </div>

      <Demo key={mode} mode={mode} />
    </div>
  );
}
