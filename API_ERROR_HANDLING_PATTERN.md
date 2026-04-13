/\*

- API ERROR HANDLING PATTERN - IMPLEMENTATION GUIDE
-
- This file documents how to add error handling to all data components
- that use React Query hooks
  \*/

// ============================================================================
// STEP 1: Import ApiError Component
// ============================================================================
import { ApiError } from "@/components/ui/api-error";

// ============================================================================
// STEP 2: Capture error from useQuery hooks
// ============================================================================
// BEFORE:
// const { data, isLoading } = useSomeDataHook();

// AFTER:
// const { data, isLoading, error } = useSomeDataHook();

// ============================================================================
// STEP 3: Check for errors in return statement
// ============================================================================
// PATTERN #1 - For simple layouts with single error check:
/_
return (
<>
{error && (
<div className="w-full h-full flex items-center justify-center">
<ApiError
title="Terjadi Kesalahan Server"
message={error?.message || "Gagal mengambil data. Silakan coba lagi nanti."}
error={error}
/>
</div>
)}
{!error && (
<CardComponent>
{_/ /_ Your normal content here _/ /_}
</CardComponent>
)}
</>
);
_/

// PATTERN #2 - For multiple API calls with multiple errors:
/_
return (
<>
{(error1 || error2 || error3) && (
<div className="w-full h-full flex items-center justify-center">
<ApiError
title="Terjadi Kesalahan Server"
message={
error1?.message || error2?.message || error3?.message ||
"Gagal mengambil data. Silakan coba lagi nanti."
}
error={error1 || error2 || error3}
/>
</div>
)}
{!error1 && !error2 && !error3 && (
<CardComponent>
{_/ /_ Your normal content here _/ /_}
</CardComponent>
)}
</>
);
_/

// ============================================================================
// STEP 4: Conditionally render content
// ============================================================================
// Wrap your existing JSX with {!error && ( ... )}
// This ensures error message displays instead of broken layout

// ============================================================================
// QUICK CHECKLIST FOR EACH FILE
// ============================================================================
// [ ] Import ApiError from "@/components/ui/api-error"
// [ ] Add ", error" to each useQuery hook destructuring
// [ ] Add error check before return statement main JSX
// [ ] Wrap existing CardComponent/content with conditional render
// [ ] Test by simulating API failure in browser devtools

// ============================================================================
// EXAMPLE: Complete Implementation
// ============================================================================
// See: components/section/roby/data/pajak/data-pajak-PBJT.tsx
// This file is the reference implementation for all other components
