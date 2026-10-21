import type { CSSProperties, ReactNode } from "react";
import type { SceneId } from "@/content/types";

const vars = (values: Record<string, string | number>) =>
  values as CSSProperties;

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="scene__window">
      <div className="scene__chrome">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <div className="scene__body">{children}</div>
    </div>
  );
}

function Subscriptions() {
  const rows = [
    { plan: "Monthly", width: "72%" },
    { plan: "Yearly", width: "58%" },
    { plan: "Monthly", width: "80%", trial: true },
    { plan: "Yearly", width: "64%" },
    { plan: "Monthly", width: "54%" },
    { plan: "Yearly", width: "76%" },
  ];
  return (
    <Window title="Customers">
      <div className="scene-subs">
        <div>
          <div className="scene-subs__row scene-subs__row--head">
            <span>Customer</span>
            <span>Plan</span>
            <span>Status</span>
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              className="scene-subs__row scene-step"
              style={vars({ "--i": i })}
            >
              <span className="scene__avatar" />
              <span
                className="scene__line"
                style={vars({ "--w": row.width })}
              />
              <span className="scene__pill">{row.plan}</span>
              {row.trial ? (
                <span className="scene__swap">
                  <span className="scene__badge scene__badge--wait">Trial</span>
                  <span className="scene__badge">Active</span>
                </span>
              ) : (
                <span className="scene__badge">Active</span>
              )}
            </div>
          ))}
        </div>
        <div className="scene-subs__chart">
          <span className="scene__label">Subscriptions</span>
          <div className="scene-subs__bars">
            {[38, 52, 46, 64, 72, 88].map((h, i) => (
              <i key={i} style={vars({ "--h": `${h}%`, "--i": i })} />
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

function Inventory() {
  return (
    <>
      <div className="scene__phone">
        <span className="scene__notch" />
        <p className="scene__title">Orders</p>
        <div className="scene-inv__order">
          <span className="scene__line" style={vars({ "--w": "60%" })} />
          <div className="scene-inv__steps">
            <span className="scene-inv__fill" />
            <i />
            <i />
            <i />
          </div>
          <div className="scene-inv__labels">
            <span>Ordered</span>
            <span>Packed</span>
            <span>Delivered</span>
          </div>
        </div>
        {["Ordered", "Packed", "Delivered"].map((status, i) => (
          <div
            key={status}
            className="scene-inv__order scene-inv__order--small scene-step"
            style={vars({ "--i": i + 1 })}
          >
            <span className="scene__line" style={vars({ "--w": "70%" })} />
            <span
              className={
                status === "Ordered"
                  ? "scene__badge scene__badge--wait"
                  : "scene__badge"
              }
            >
              {status}
            </span>
          </div>
        ))}
      </div>
      <div className="scene-inv__stock">
        <span className="scene__label">Stock by branch</span>
        {[
          ["Branch A", "72%"],
          ["Branch B", "46%"],
          ["Branch C", "84%"],
        ].map(([branch, w], i) => (
          <div key={branch} className="scene-inv__branch">
            <span>{branch}</span>
            <span className="scene-inv__bar">
              <i style={vars({ "--w": w, "--i": i })} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Bookings() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const blocks = [
    { day: 0, row: 0, span: 2 },
    { day: 1, row: 1, span: 1 },
    { day: 2, row: 0, span: 1 },
    { day: 3, row: 1, span: 2 },
    { day: 2, row: 2, span: 2 },
    { day: 4, row: 0, span: 1 },
    { day: 0, row: 3, span: 1 },
    { day: 4, row: 2, span: 2 },
    { day: 1, row: 4, span: 2 },
    { day: 3, row: 4, span: 1 },
    { day: 4, row: 5, span: 1 },
  ];
  return (
    <Window title="Bookings">
      <div className="scene-book">
        <div className="scene-book__side">
          <span className="scene__roles">
            {["Student", "Tutor", "Admin"].map((role, i) => (
              <span key={role} style={vars({ "--i": i })}>
                {role}
              </span>
            ))}
          </span>
          {["80%", "62%", "70%", "54%"].map((w, i) => (
            <span key={i} className="scene__line" style={vars({ "--w": w })} />
          ))}
        </div>
        <div className="scene-book__grid">
          {days.map((day, d) => (
            <span
              key={day}
              className="scene-book__day"
              style={{ gridColumn: d + 1 }}
            >
              {day}
            </span>
          ))}
          {days.flatMap((day, d) =>
            [0, 1, 2, 3, 4, 5].map((r) => (
              <span
                key={`${day}-${r}`}
                className="scene-book__cell"
                style={{ gridColumn: d + 1, gridRow: r + 2 }}
              />
            )),
          )}
          {blocks.map((b, i) => (
            <span
              key={i}
              className="scene-book__block"
              style={{
                gridColumn: b.day + 1,
                gridRow: `${b.row + 2} / span ${b.span}`,
                ...vars({ "--i": i }),
              }}
            />
          ))}
        </div>
      </div>
    </Window>
  );
}

function Sessions() {
  return (
    <Window title="Book a session">
      <div className="scene-sess">
        <div>
          <span className="scene__label">Pick a time</span>
          <div className="scene-sess__days">
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <i key={d} className={d === 3 ? "is-on" : undefined} />
            ))}
          </div>
          <div className="scene-sess__slots">
            {["09:00", "10:30", "14:00", "16:30"].map((time) => (
              <span
                key={time}
                className={
                  time === "10:30"
                    ? "scene-sess__slot scene-sess__slot--picked"
                    : "scene-sess__slot"
                }
              >
                {time}
              </span>
            ))}
          </div>
          <span className="scene-sess__pay">Book &amp; pay</span>
        </div>
        <div className="scene-sess__call">
          <span className="scene-sess__rec">REC</span>
          <span className="scene-sess__toast">Paid ✓</span>
          <span className="scene-sess__tile">
            <span className="scene__avatar" />
          </span>
          <span className="scene-sess__tile">
            <span className="scene__avatar" />
          </span>
          <span className="scene-sess__controls">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </Window>
  );
}

const SCENES: Record<SceneId, () => ReactNode> = {
  subscriptions: Subscriptions,
  inventory: Inventory,
  bookings: Bookings,
  sessions: Sessions,
};

export function ProjectScene({
  scene,
  accent,
  label,
}: {
  scene: SceneId;
  accent: string;
  label?: string;
}) {
  const Scene = SCENES[scene];
  return (
    <div
      className={`scene scene--${scene}`}
      data-scene=""
      role="img"
      aria-label={label}
      style={vars({ "--accent": accent })}
    >
      <Scene />
    </div>
  );
}
