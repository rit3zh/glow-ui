"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Tag,
  Zap,
  Bug,
  Plus,
  ArrowUp,
  Sparkles,
  Shield,
  Wrench,
  Loader2,
  ExternalLink,
  Download,
  Star,
  GitBranch,
} from "lucide-react";

const ChangelogPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState([]);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GitHub repository info - you can change this to your repo
  const GITHUB_OWNER = "rit3zh";
  const GITHUB_REPO = "glow-ui";
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;

  // Function to parse release body and categorize changes
  const parseReleaseBody = (body) => {
    if (!body) return [];

    const changes = [];
    const lines = body.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        const text = trimmedLine.substring(2).trim();
        let type = "improvement";
        let title = text;
        let description = "";

        // Try to categorize based on keywords
        const lowerText = text.toLowerCase();
        if (
          lowerText.includes("add") ||
          lowerText.includes("new") ||
          lowerText.includes("feature")
        ) {
          type = "feature";
        } else if (
          lowerText.includes("fix") ||
          lowerText.includes("bug") ||
          lowerText.includes("resolve")
        ) {
          type = "fix";
        } else if (
          lowerText.includes("security") ||
          lowerText.includes("vulnerability")
        ) {
          type = "security";
        } else if (
          lowerText.includes("break") ||
          lowerText.includes("breaking")
        ) {
          type = "breaking";
        }

        // Split title and description if there's a colon or dash
        if (text.includes(":")) {
          const parts = text.split(":");
          title = parts[0].trim();
          description = parts.slice(1).join(":").trim();
        } else if (text.includes(" - ")) {
          const parts = text.split(" - ");
          title = parts[0].trim();
          description = parts.slice(1).join(" - ").trim();
        }

        changes.push({ type, title, description: description || title });
      } else if (trimmedLine && !trimmedLine.startsWith("#")) {
        // Handle plain text lines
        changes.push({
          type: "improvement",
          title: trimmedLine,
          description: trimmedLine,
        });
      }
    });

    // If no structured changes found, create a general entry
    if (changes.length === 0 && body.trim()) {
      changes.push({
        type: "improvement",
        title: "Release Update",
        description:
          body.trim().substring(0, 200) + (body.length > 200 ? "..." : ""),
      });
    }

    return changes;
  };

  // Function to determine release type based on version
  const getReleaseType = (version) => {
    const cleanVersion = version.replace(/^v/, "");
    const parts = cleanVersion.split(".");

    if (parts.length >= 3) {
      const [major, minor, patch] = parts;
      if (patch !== "0") return "patch";
      if (minor !== "0") return "minor";
      return "major";
    }
    return "minor";
  };

  // Fetch releases from GitHub API
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const response = await fetch(GITHUB_API_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch releases: ${response.status}`);
        }

        const data = await response.json();

        // Transform GitHub releases to our format
        const transformedReleases = data.map((release, index) => ({
          id: release.id,
          version: release.tag_name,
          date: release.published_at,
          type: getReleaseType(release.tag_name),
          name: release.name,
          body: release.body,
          url: release.html_url,
          downloadUrl: release.zipball_url,
          author: release.author,
          prerelease: release.prerelease,
          draft: release.draft,
          changes: parseReleaseBody(release.body),
        }));

        setReleases(transformedReleases);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  const changelogData = releases;

  const typeConfig = {
    feature: {
      icon: Plus,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      label: "New",
    },
    improvement: {
      icon: ArrowUp,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      label: "Improved",
    },
    fix: {
      icon: Bug,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      label: "Fixed",
    },
    security: {
      icon: Shield,
      color: "text-red-400",
      bg: "bg-red-400/10",
      label: "Security",
    },
    breaking: {
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      label: "Breaking",
    },
  };

  const versionTypeConfig = {
    major: {
      color: "text-purple-400",
      bg: "bg-purple-400/20",
      label: "Major Release",
    },
    minor: {
      color: "text-blue-400",
      bg: "bg-blue-400/20",
      label: "Minor Release",
    },
    patch: {
      color: "text-green-400",
      bg: "bg-green-400/20",
      label: "Patch Release",
    },
  };

  useEffect(() => {
    // Animate items in with stagger effect
    if (!loading && changelogData.length > 0) {
      const timer = setTimeout(() => {
        setVisibleItems(changelogData.map((_, index) => index));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, changelogData]);

  const filteredData =
    selectedFilter === "all"
      ? changelogData
      : changelogData.filter((item) =>
          item.changes.some((change) => change.type === selectedFilter),
        );

  const filters = [
    { key: "all", label: "All Changes", icon: Sparkles },
    { key: "feature", label: "Features", icon: Plus },
    { key: "improvement", label: "Improvements", icon: ArrowUp },
    { key: "fix", label: "Bug Fixes", icon: Bug },
    { key: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 animate-pulse"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-bounce"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <GitBranch className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-300">GitHub Releases</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm text-gray-400">
              {GITHUB_OWNER}/{GITHUB_REPO}
            </span>
          </div>

          <h1 className="text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight tracking-tight">
            Changelog
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Stay up to date with the latest releases, features, and
            improvements. All updates are automatically fetched from our GitHub
            repository.
          </p>

          {loading && (
            <div className="flex items-center justify-center gap-3 text-purple-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading releases...</span>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <p className="font-medium">Failed to load releases</p>
              <p className="text-red-300 mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Filters */}
        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedFilter === filter.key
                      ? "bg-white/10 text-white shadow-lg shadow-white/20 border border-white/20"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Changelog Items */}
        {!loading && !error && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">No releases found</p>
              </div>
            ) : (
              filteredData.map((release, index) => {
                const versionConfig = versionTypeConfig[release.type];
                const isVisible = visibleItems.includes(index);

                return (
                  <div
                    key={release.id}
                    className={`group transform transition-all duration-700 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                      {/* Animated border gradient */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>

                      {/* Release Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                                {
                                  release.version
                                    .replace(/^v/, "")
                                    .split(".")[0]
                                }
                              </div>
                              {release.prerelease && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-black animate-pulse"></div>
                              )}
                              {!release.prerelease && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-white">
                                  {release.name || release.version}
                                </h2>
                                {release.prerelease && (
                                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-md font-medium">
                                    Pre-release
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${versionConfig.bg} ${versionConfig.color}`}
                                >
                                  {versionConfig.label}
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-400">
                                  {release.version}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <time className="text-sm font-medium">
                              {new Date(release.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </time>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={release.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                            <a
                              href={release.downloadUrl}
                              className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Changes */}
                      {release.changes.length > 0 ? (
                        <div className="space-y-4">
                          {release.changes.map((change, changeIndex) => {
                            const config = typeConfig[change.type];
                            const Icon = config?.icon || Wrench;

                            return (
                              <div
                                key={changeIndex}
                                className="group/item flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2"
                              >
                                <div
                                  className={`flex-shrink-0 w-10 h-10 ${config?.bg || "bg-gray-400/10"} rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300`}
                                >
                                  <Icon
                                    className={`w-5 h-5 ${config?.color || "text-gray-400"}`}
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-white group-hover/item:text-purple-200 transition-colors">
                                      {change.title}
                                    </h3>
                                    <span
                                      className={`px-2 py-1 rounded-md text-xs font-medium ${config?.bg || "bg-gray-400/10"} ${config?.color || "text-gray-400"}`}
                                    >
                                      {config?.label || "Update"}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-sm leading-relaxed group-hover/item:text-gray-300 transition-colors">
                                    {change.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>
                            No detailed changelog available for this release.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Want to suggest a feature or report a bug?{" "}
            <a
              href="https://github.com/rit3zh/glow-ui/issues/new"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
