// import type { GamePlan } from '@/types';
// import React from 'react'

// const GamePlanDetail = ({selectedGameplan}: { selectedGameplan:GamePlan
// }) => {
//   return (
//       {openGamePlan && isViewMode && (
//         <div
//           ref={formRef}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs"
//         >
//           <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg rounded-b-lg border border-gray-800 bg-gray-950 text-white">
//             <div className="flex items-center justify-between border-b border-gray-800 bg-white p-4">
//               <h2 className="font-righteous text-lg font-normal text-gray-900 sm:text-xl">
//                 {isViewMode ? "View GamePlan" : "Create GamePlan"}
//               </h2>
//               <button
//                 className="text-xl font-bold text-gray-400 hover:text-white"
//                 aria-label="Close"
//                 onClick={() => {
//                   setOpenGamePlan(false);
//                   setGamePlanMode("view");
//                   setSelectedGameplan(null);
//                 }}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-6">
//               <div className="flex flex-col gap-2 space-y-2 p-4 text-sm sm:text-base">
//                 <div className="flex flex-col gap-2">
//                   <div className="text-xs text-gray-400 sm:text-sm">Name</div>
//                   <div>{selectedGameplan?.name}</div>
//                 </div>
//                 <div className="flex flex-col space-x-2">
//                   <div className="text-xs text-gray-400 sm:text-sm">
//                     Opponent
//                   </div>
//                   <div>{selectedGameplan?.opponent}</div>
//                 </div>
//                 <div className="flex flex-col space-x-2">
//                   <div className="text-xs text-gray-400 sm:text-sm">Notes</div>
//                   <div>{selectedGameplan?.notes}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {isCoach && (
//             <Button
//               onClick={() => {
//                 setGamePlanMode("edit");
//               }}
//               variant="secondary"
//             >
//               Edit GamePlan
//             </Button>
//           )}
//         </div>
//       )}
//   )
// }

// export default GamePlanDetail
